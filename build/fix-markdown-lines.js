#!/usr/bin/env node
/**
 * Markdown line wrapper script
 * Wraps long lines in markdown files to adhere to line length limits
 */

import { execSync } from "node:child_process"
import fs from "node:fs"

// Configuration
const MAX_LINE_LENGTH = 80
const MARKDOWN_GLOB =
  ".github/**/*.md docs/**/*.md src/**/*.md README.md CHANGELOG.md"

// Get list of markdown files to process
const getFiles = () => {
  try {
    let allFiles = []

    // Add individual files if they exist
    const individualFiles = ["./README.md", "./CHANGELOG.md"]
    for (const file of individualFiles) {
      if (fs.existsSync(file)) {
        allFiles.push(file)
      }
    }

    // Find files in directories using glob patterns
    const directories = [".github", "docs", "src"]
    for (const dir of directories) {
      if (fs.existsSync(dir)) {
        try {
          const cmd = `find ${dir} -name "*.md" -type f 2>/dev/null`
          const result = execSync(cmd, { encoding: "utf8" })
          const foundFiles = result.split("\n").filter(Boolean)
          allFiles = allFiles.concat(foundFiles)
        } catch (e) {
          // Ignore errors for individual directories
        }
      }
    }

    return [...new Set(allFiles)].filter(
      f => !f.includes("node_modules") && !f.includes("dist")
    )
  } catch (error) {
    console.error("Error finding markdown files:", error.message)
    return []
  }
}

// Wrap long lines in a markdown file
const wrapLongLines = (filePath) => {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, "utf8")
    const lines = content.split("\n")
    let modified = false
    let inCodeBlock = false

    // Process each line
    const wrappedLines = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Track code block state
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock
        wrappedLines.push(line)
        continue
      }

      // Skip processing if inside code block, indented code, table, HTML, or comments
      if (
        inCodeBlock ||
        line.startsWith("    ") ||
        line.startsWith("\t") ||
        line.match(/^\|.*\|$/) ||
        line.match(/^<.*>.*>$/) ||
        line.trim() === "" ||
        line.trim().startsWith("<!--") ||
        line.trim().endsWith("-->")
      ) {
        wrappedLines.push(line)
        continue
      }

      // Handle line wrapping based on content type
      if (line.length > MAX_LINE_LENGTH) {
        modified = true

        // Handle headings
        if (line.match(/^#{1,6}\s/)) {
          const headingMatch = line.match(/^(#{1,6}\s+)(.*)/)
          if (headingMatch) {
            const prefix = headingMatch[1]
            const content = headingMatch[2]

            // For headings, try to wrap at word boundaries
            if (content.length <= MAX_LINE_LENGTH - prefix.length) {
              wrappedLines.push(line)
            } else {
              let remainder = content
              wrappedLines.push(prefix + remainder.substring(0, MAX_LINE_LENGTH - prefix.length))
              remainder = remainder.substring(MAX_LINE_LENGTH - prefix.length)

              while (remainder.length > 0) {
                const chunkLength = Math.min(remainder.length, MAX_LINE_LENGTH)
                wrappedLines.push(remainder.substring(0, chunkLength))
                remainder = remainder.substring(chunkLength)
              }
            }
          }
        }
        // Handle list items
        else if (line.match(/^(\s*[*-+]\s+|\s*\d+\.\s+)/)) {
          const listMatch = line.match(/^(\s*(?:[*-+]|\d+\.)\s+)(.*)/)
          if (listMatch) {
            const prefix = listMatch[1]
            const content = listMatch[2]

            // Wrap list content with proper indentation
            let remainder = content
            const continuationIndent = " ".repeat(prefix.length)

            // First line
            const firstLineLength = MAX_LINE_LENGTH - prefix.length
            if (remainder.length <= firstLineLength) {
              wrappedLines.push(line)
            } else {
              let breakPoint = remainder.lastIndexOf(" ", firstLineLength)
              if (breakPoint === -1) breakPoint = firstLineLength

              wrappedLines.push(prefix + remainder.substring(0, breakPoint))
              remainder = remainder.substring(breakPoint).trim()

              // Continuation lines
              while (remainder.length > 0) {
                const availableLength = MAX_LINE_LENGTH - continuationIndent.length
                if (remainder.length <= availableLength) {
                  wrappedLines.push(continuationIndent + remainder)
                  break
                }

                breakPoint = remainder.lastIndexOf(" ", availableLength)
                if (breakPoint === -1) breakPoint = availableLength

                wrappedLines.push(continuationIndent + remainder.substring(0, breakPoint))
                remainder = remainder.substring(breakPoint).trim()
              }
            }
          }
        }
        // Handle regular paragraphs
        else {
          const leadingSpaceMatch = line.match(/^(\s*)/)
          const leadingSpace = leadingSpaceMatch ? leadingSpaceMatch[1] : ""
          let remainder = line.trim()

          // Check if line contains markdown links with URLs
          const linkPattern = /\[([^\]]*)\]\(([^)]*)\)/g
          const hasLinks = linkPattern.test(remainder)

          if (hasLinks) {
            // Handle lines with markdown links more carefully
            // Try to avoid breaking URLs
            let currentPos = 0
            const wrappedLineParts = []

            while (currentPos < remainder.length) {
              const availableLength = MAX_LINE_LENGTH - leadingSpace.length

              if (remainder.length - currentPos <= availableLength) {
                // Remaining text fits
                wrappedLineParts.push(leadingSpace + remainder.substring(currentPos))
                break
              }

              // Find next link in the remaining text
              const remainingText = remainder.substring(currentPos)
              const linkMatch = remainingText.match(/\[([^\]]*)\]\(([^)]*)\)/)

              if (linkMatch && linkMatch.index !== undefined) {
                const linkStart = currentPos + linkMatch.index
                const linkEnd = linkStart + linkMatch[0].length

                // If link starts within our available space
                if (linkMatch.index < availableLength) {
                  // If entire link fits, include it
                  if (linkEnd - currentPos <= availableLength) {
                    wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, linkEnd))
                    currentPos = linkEnd
                  } else {
                    // Break before the link
                    if (linkStart > currentPos) {
                      wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, linkStart))
                      currentPos = linkStart
                    } else {
                      // Link is too long, break it
                      wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, currentPos + availableLength))
                      currentPos += availableLength
                    }
                  }
                } else {
                  // Break at word boundary before link
                  const breakPoint = remainder.lastIndexOf(" ", currentPos + availableLength)
                  if (breakPoint > currentPos) {
                    wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, breakPoint))
                    currentPos = breakPoint + 1
                  } else {
                    wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, currentPos + availableLength))
                    currentPos += availableLength
                  }
                }
              } else {
                // No more links, break at word boundary
                const breakPoint = remainder.lastIndexOf(" ", currentPos + availableLength)
                if (breakPoint > currentPos) {
                  wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, breakPoint))
                  currentPos = breakPoint + 1
                } else {
                  wrappedLineParts.push(leadingSpace + remainder.substring(currentPos, currentPos + availableLength))
                  currentPos += availableLength
                }
              }
            }

            wrappedLines.push(...wrappedLineParts)
          } else {
            // Handle normal text without links
            while (remainder.length > 0) {
              const availableLength = MAX_LINE_LENGTH - leadingSpace.length

              if (remainder.length <= availableLength) {
                wrappedLines.push(leadingSpace + remainder)
                break
              }

              // Find good break point
              let breakPoint = remainder.lastIndexOf(" ", availableLength)
              if (breakPoint === -1) breakPoint = availableLength

              wrappedLines.push(leadingSpace + remainder.substring(0, breakPoint))
              remainder = remainder.substring(breakPoint).trim()
            }
          }
        }
      } else {
        wrappedLines.push(line)
      }
    }

    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, wrappedLines.join("\n"))
      console.log(`Fixed line length issues in ${filePath}`)
      return true
    }

    return false
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message)
    return false
  }
}

// Main execution
const files = getFiles()
console.log(`Found ${files.length} markdown files to process`)

let fixedCount = 0
for (const file of files) {
  if (wrapLongLines(file)) {
    fixedCount++
  }
}

console.log(`Fixed line length issues in ${fixedCount} files`)
