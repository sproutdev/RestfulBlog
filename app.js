var bodyParser        = require("body-parser"),                     //req.body
    expressSanitizer  = require("express-sanitizer"),               // sanitize code, avoid script to hack
    mongoose          = require("mongoose"),                        //mongodb schema
    express           = require("express"),                         //express
    method            = require("method-override"),                 //PUT 
    app               = express(),                                  //def            
    path              = require("path");                            //to get to a path, not needed
    
    
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });                // database connect
app.set("view engine", "ejs");                                                                      // to avoid using .ejs everywhere
app.use(express.static("public"));                                                                  // To serve static files(images, css, JS even)
app.use(bodyParser.urlencoded({extended: true}));                                                   //body parser        
app.use(expressSanitizer());                                                                        //sanitize code
app.use(method("_method"));                                                                         //method override def


//mongoose model schema def
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
            console.log("Error");
        else
            res.render("index", {blogs: blogs});
    });
});


//NEW

app.get("/blogs/new", function(req, res){
    res.render("new"); 
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
            res.render("new")
        else
            res.redirect("/blogs"); 
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err)
            res.send(err);
        else    
         res.render("show", {blog: foundBlog});
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/blogs");
        else
            res.render("edit", {blog: foundBlog});
    });
});

//Update route

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err)
            res.send(err);
       else
         res.redirect("/blogs/" + req.params.id);
    });
});


//Delete Route

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs"); 
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started"); 
});
