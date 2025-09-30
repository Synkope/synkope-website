#!/usr/bin/env node

import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, "../images"),
  outputDir: path.join(__dirname, "../dist/images"),
  backupDir: path.join(__dirname, "../images-backup"),
  quality: {
    jpeg: 85,
    png: 90,
    webp: 90,
  },
  createWebP: true,
  createBackup: true,
};

/**
 * Create directory if it doesn't exist
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

/**
 * Get file size in KB
 */
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return Math.round((stats.size / 1024) * 100) / 100;
  } catch {
    return 0;
  }
}

/**
 * Create backup of original images
 */
async function createBackup() {
  if (!CONFIG.createBackup) return;

  console.log("💾 Creating backup of original images...");

  try {
    await ensureDir(CONFIG.backupDir);

    const files = await fs.readdir(CONFIG.inputDir);
    const imageFiles = files.filter((file) => /\.(jpe?g|png|svg|gif)$/i.test(file));

    for (const file of imageFiles) {
      const sourcePath = path.join(CONFIG.inputDir, file);
      const backupPath = path.join(CONFIG.backupDir, file);

      try {
        await fs.access(backupPath);
        console.log(`⏭️  Backup already exists: ${file}`);
      } catch {
        await fs.copyFile(sourcePath, backupPath);
        console.log(`📋 Backed up: ${file}`);
      }
    }
  } catch (error) {
    console.error("❌ Error creating backup:", error.message);
    throw error;
  }
}

/**
 * Optimize JPEG images
 */
async function optimizeJPEG() {
  console.log("🖼️  Optimizing JPEG images...");

  const files = await imagemin([`${CONFIG.inputDir}/*.{jpg,jpeg}`], {
    destination: CONFIG.outputDir,
    plugins: [
      imageminMozjpeg({
        quality: CONFIG.quality.jpeg,
        progressive: true,
      }),
    ],
  });

  return files;
}

/**
 * Optimize PNG images
 */
async function optimizePNG() {
  console.log("🎨 Optimizing PNG images...");

  const files = await imagemin([`${CONFIG.inputDir}/*.png`], {
    destination: CONFIG.outputDir,
    plugins: [
      imageminPngquant({
        quality: [0.65, CONFIG.quality.png / 100],
        strip: true,
      }),
    ],
  });

  return files;
}

/**
 * Optimize SVG images
 */
async function optimizeSVG() {
  console.log("🎯 Optimizing SVG images...");

  const files = await imagemin([`${CONFIG.inputDir}/*.svg`], {
    destination: CONFIG.outputDir,
    plugins: [
      imageminSvgo({
        plugins: [
          {
            name: "removeViewBox",
            active: false,
          },
          {
            name: "removeDimensions",
            active: true,
          },
          {
            name: "cleanupNumericValues",
            params: {
              floatPrecision: 2,
            },
          },
        ],
      }),
    ],
  });

  return files;
}

/**
 * Create WebP versions of images
 */
async function createWebPVersions() {
  if (!CONFIG.createWebP) return [];

  console.log("🚀 Creating WebP versions...");

  const files = await imagemin([`${CONFIG.inputDir}/*.{jpg,jpeg,png}`], {
    destination: CONFIG.outputDir,
    plugins: [
      imageminWebp({
        quality: CONFIG.quality.webp,
        method: 6, // Compression method (0-6, 6 is slowest but best)
        crop: {
          width: 0,
          height: 0,
          x: 0,
          y: 0,
        },
      }),
    ],
  });

  return files;
}

/**
 * Copy non-optimizable images (GIF, etc.)
 */
async function copyOtherImages() {
  console.log("📄 Copying other image formats...");

  try {
    const files = await fs.readdir(CONFIG.inputDir);
    const otherFiles = files.filter((file) => /\.(gif|ico|webp)$/i.test(file));

    const copiedFiles = [];
    for (const file of otherFiles) {
      const sourcePath = path.join(CONFIG.inputDir, file);
      const destPath = path.join(CONFIG.outputDir, file);

      await fs.copyFile(sourcePath, destPath);
      copiedFiles.push({
        sourcePath,
        destinationPath: destPath,
      });

      console.log(`📋 Copied: ${file}`);
    }

    return copiedFiles;
  } catch (error) {
    console.warn("⚠️  No other image formats to copy:", error.message);
    return [];
  }
}

/**
 * Generate optimization report
 */
async function generateReport(optimizedFiles) {
  console.log("\n📊 Optimization Report");
  console.log("=".repeat(50));

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let fileCount = 0;

  for (const file of optimizedFiles) {
    if (file.sourcePath && file.destinationPath) {
      const originalSize = await getFileSize(file.sourcePath);
      const optimizedSize = await getFileSize(file.destinationPath);

      if (originalSize > 0 && optimizedSize > 0) {
        const savings = originalSize - optimizedSize;
        const savingsPercent = Math.round((savings / originalSize) * 100);

        console.log(
          `📁 ${path.basename(file.sourcePath)}: ${originalSize}KB → ${optimizedSize}KB (${savingsPercent}% saved)`,
        );

        totalOriginalSize += originalSize;
        totalOptimizedSize += optimizedSize;
        fileCount++;
      }
    }
  }

  if (fileCount > 0) {
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const totalSavingsPercent = Math.round((totalSavings / totalOriginalSize) * 100);

    console.log("=".repeat(50));
    console.log(`📈 Total: ${totalOriginalSize}KB → ${totalOptimizedSize}KB`);
    console.log(`💾 Total savings: ${totalSavings}KB (${totalSavingsPercent}%)`);
    console.log(`🗂️  Files processed: ${fileCount}`);
  } else {
    console.log("ℹ️  No files processed or no size data available");
  }
}

/**
 * Main optimization function
 */
async function optimizeImages() {
  console.log("🚀 Starting image optimization...\n");

  try {
    // Ensure output directory exists
    await ensureDir(CONFIG.outputDir);

    // Create backup
    await createBackup();

    console.log("\n🔄 Processing images...");

    // Run optimizations in parallel
    const [jpegFiles, pngFiles, svgFiles, webpFiles, otherFiles] = await Promise.all([
      optimizeJPEG().catch((err) => {
        console.warn("⚠️  JPEG optimization warning:", err.message);
        return [];
      }),
      optimizePNG().catch((err) => {
        console.warn("⚠️  PNG optimization warning:", err.message);
        return [];
      }),
      optimizeSVG().catch((err) => {
        console.warn("⚠️  SVG optimization warning:", err.message);
        return [];
      }),
      createWebPVersions().catch((err) => {
        console.warn("⚠️  WebP creation warning:", err.message);
        return [];
      }),
      copyOtherImages(),
    ]);

    // Combine all results
    const allFiles = [...jpegFiles, ...pngFiles, ...svgFiles, ...webpFiles, ...otherFiles];

    // Generate report
    await generateReport(allFiles);

    console.log("\n✅ Image optimization completed successfully!");
    console.log(`📍 Optimized images saved to: ${CONFIG.outputDir}`);

    if (CONFIG.createBackup) {
      console.log(`💾 Original images backed up to: ${CONFIG.backupDir}`);
    }

    if (CONFIG.createWebP && webpFiles.length > 0) {
      console.log(`🚀 ${webpFiles.length} WebP versions created for modern browsers`);
    }
  } catch (error) {
    console.error("\n❌ Image optimization failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

/**
 * CLI interface
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🖼️  Image Optimization Script

Usage: node optimize-images.js [options]

Options:
  --no-backup    Skip creating backup of original images
  --no-webp      Skip creating WebP versions
  --quality=N    Set JPEG quality (1-100, default: ${CONFIG.quality.jpeg})
  --help, -h     Show this help message

Examples:
  node optimize-images.js
  node optimize-images.js --no-backup --quality=90
  node optimize-images.js --no-webp
`);
    process.exit(0);
  }

  // Parse options
  if (args.includes("--no-backup")) {
    CONFIG.createBackup = false;
  }

  if (args.includes("--no-webp")) {
    CONFIG.createWebP = false;
  }

  const qualityArg = args.find((arg) => arg.startsWith("--quality="));
  if (qualityArg) {
    const quality = parseInt(qualityArg.split("=")[1]);
    if (quality >= 1 && quality <= 100) {
      CONFIG.quality.jpeg = quality;
      CONFIG.quality.png = quality;
      CONFIG.quality.webp = quality;
    }
  }

  // Run optimization
  optimizeImages();
}

export { optimizeImages, CONFIG };
