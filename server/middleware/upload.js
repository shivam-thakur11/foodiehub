import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  const ext = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, JPG, PNG, or WebP images are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

export default upload
