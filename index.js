import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";


const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let postData = [];
// Get home page

app.get("/",(req,res)=>{
res.render("index.ejs",{
    postData: postData,
});
});



// Get blog page
app.get("/blog",(req,res)=>{
    res.render("blog.ejs");
});



// Post blog

app.post("/publish",(req,res)=>{
    const options = {day: 'numeric', month: 'long', year:'numeric'};
    let postDate = new Date().toLocaleDateString('en-US', options);
const content =req.body.content;
const name = req.body.name;
const title = req.body.title;

    let inputData = {title:title , name:name , content:content, postDate};
    postData.push(inputData);

    res.redirect("/post");
});

//  Get post Page
app.get("/post",(req,res)=>{
    
    res.render("post.ejs",{
        postData:postData,
        
  
    });
});

// Get Post data

app.get("/postData/:inputName",(req,res)=>{
    const requestedTitle = _.lowerCase(req.params.inputName);
    postData.forEach((inputData)=>{
        if(requestedTitle === _.lowerCase(inputData.title)){
            res.render("viewPost.ejs",{
                title:inputData.title,
                name: inputData.name,
                content:inputData.content,
                date: inputData.postDate
            });
        }
    });
});




// Get edit post
app.get("/edit/:inputName",(req,res)=>{
const editTitle = _.lowerCase(req.params.inputName);
postData.forEach((inputData)=>{
    if(editTitle === _.lowerCase(inputData.title)){
        res.render("edit.ejs",{
            title:  inputData.title,
            name: inputData.name,
            content: inputData.content,
        });
    }
});
});


// Post edit data

app.post("/edit/:inputName",(req,res)=>{
    const reqTitle = _.lowerCase(req.params.inputName);
    let position = -1;
    postData.forEach((inputData,index)=>{
        if(reqTitle === _.lowerCase(inputData.title)){
        const options = {day: 'numeric', month: 'long', year:'numeric' };
        let postDate = new Date().toLocaleDateString('en-US',options);
        const {content, title , name} = req.body;
        let editData = {title:title, name: name, content: content, postDate};
        position = index;
        postData.splice(position,1,editData);
        res.redirect("/post")

        }
    });
});

// Delete Post
app.get("/delete/:inputName",(req,res)=>{
    const delTitle = _.lowerCase(req.params.inputName);
    let position = -1;
     postData.forEach((inputData,index)=>{
   if(delTitle === _.lowerCase(inputData.title)){
    position = index;
    postData.splice(position,1);
    res.redirect("/");
   }

     });
});


app.listen(port,()=>{
    console.log(`The server starts on the port ${port}`);
});