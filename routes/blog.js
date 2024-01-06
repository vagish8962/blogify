const { Router } = require('express');
const Blog = require('../models/blog');
const routers = Router();

routers.get('/', function (req, res) {
    return res.render('addBlog', {
         user: req.user,
         });
});

routers.post('/',  async (req, res) => {
    const body1  = req.body;
    
    const { title, body } = body1
    const blog = await Blog.create({
        title: title,
        body,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${blog._id}`);


});

routers.get('/:id', async (req, res) => {
   const blog = await Blog.findOne({_id: req.params.id}).populate('createdBy');
  return res.render("blog", {
    user: req.user,
    blog
  });
});


module.exports = routers;