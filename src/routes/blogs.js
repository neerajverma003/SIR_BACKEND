const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const blogController = require('../controllers/blogController');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/', blogController.listBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', auth, upload.single('coverImage'), blogController.createBlog);
router.put('/:id', auth, upload.single('coverImage'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router;
