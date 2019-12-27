// the convention is to start this with an upper case to indicate that this allows you to define a
// new object based on the blueprint (which is the schema + model)
const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    // console.log(req.userData);
    // return res.status(200).json({}); // this is done so that console.log() can run without post.save() running

    // save() is from the Mongoose package for every model created with Mongoose, like the one we did in the post.js file.
    // Mongoose will create the right query for our DB to insert a new entry in the DB with the above post data and that auto-generated ID.
    // This is how a new entry in the DB (or "document" in the collection) is created - the collection's name will automatically be created and
    // be named lower-case plural form of the model name, so our model name is Post and so the collection will become named "posts"
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({ // 201 means "everything is ok, a new resource was created"
            message: 'Post added successfully',
            // postId: createdPost._id
            post: {
                ...createdPost, // ... is the spread operator
                id: createdPost._id
            }
        })
            .catch(error => {
                // status code of 500 means something went wrong on the server
                res.status(500).json({
                    message: 'Creating a post failed!'
                });
            });
    });
    console.log(post); // note: this is the SERVER's console, (not client's) which is in the Git Bash Terminal

}


exports.updatePost =  (req, res, next) => {
    let imagePath = req.body.imagePath; // the path we already had
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename; // the path of the newly uploaded image, if there was one
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    // console.log(post);

    // console.log(post);
    // this is a Mongoose pre-built method. The second argument is the post you want to update the record/"document" with
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then(
            result => {
                // Mongoose is smart enough to not overwrite the post in the DB if nothing was changed,
                // so if you click "Edit Post" then the "Save" button without changing the post,
                // the nModified variable (number modified) will still be 0 (you see this variable if you do console.log(result) ). 
                // So checking if "result.nModified > 0" won't work.

                // console.log(result); // this prints on the server-side terminal
                // n means "number of posts where you tried to do something"
                if (result.n > 0) {
                    res.status(200).json({ message: 'Update successful!' });
                } else {
                    res.status(401).json({ message: 'Not authorized!' });
                }
            })
        .catch(error => {
            res.statusMessage(500).json({
                message: 'Couldn\'t update post'
            });
        });

}


exports.getPosts = (req, res, next) => {
    // req.query // this is how you access query parameters
    const pageSize = +req.query.pagesize; // the query parameters here are "pagesize" and "page"
    const currentPage = +req.query.page // the + converts the string value to a numeric value
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    // this is the "model" for posts on the backend, which is similar but may include
    // different properties (e.g. user ID) than the frontend client's posts model (found at posts.model.ts).
    // This is just a vanilla javascript array, because that's the standard language for node.js,
    // so it's not an actual typescript model (now I commented it out because we're no longer using dummy data):
    // const posts = [
    //     {
    //         id: 'fadsfgh456',
    //         title: 'First server-side post',
    //         content: 'this is coming from the server'
    //     },
    //     {
    //         id: 'uiopo987yg',
    //         title: 'Second server-side post',
    //         content: 'this is coming from the server!'
    //     }
    // ];
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            // return Post.count(); // deprecation https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/learn/lecture/10554054#questions/5856458
            return Post.countDocuments();
        }).then(count => {
            // res.json(posts); <-- an array is a valid object we could turn into JSON
            // but we're going to send in a more complex object just to show we can do it.
            // So now we're sending this object as JSON.
            // 200 means "everything is ok"
            // Fetching these documents is an asynchronous task so we have to wait for them to come and then use a
            // .then() block to execute the following code whenever the asynchronous task is completed
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
}


exports.getPost = (req, res, next) => {
    // this is a Mongoose method
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed!'
            });
        });
}

exports.deletePost =  (req, res, next) => {
    // deleteOne is one of the methods listed at https://mongoosejs.com/docs/api.html#Query
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        console.log(result);
        if (result.n > 0) {
            res.status(200).json({ message: 'Deletion successful!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
    })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed'
            });
        });

    console.log(req.params.id);

}