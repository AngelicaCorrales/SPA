let logged= false;

let Home = {
    render : async () => {
        let posts = await getPostsList()
        let view =  /*html*/`
            <section class="section">
                <h1> Home </h1>
                <ul>
                    ${ posts.map(post => 
                        /*html*/`<li><a href="#/p/${post.id}">${post.title}</a></li>`
                        ).join('\n ')
                    }
                </ul>
            </section>
        `
        return view
    }
    , after_render: async () => {
    }
 
 }

 // The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

    // Lazy load view element:
    const header = null || document.getElementById('header_container');
    const content = null || document.getElementById('page_container');
    const footer = null || document.getElementById('footer_container');
    
    // Render the Header and footer of the page
    header.innerHTML = await Navbar.render();
    await Navbar.after_render();
    footer.innerHTML = await Bottombar.render();
    await Bottombar.after_render();


    // Get the parsed URl from the addressbar
    let request = Utils.parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
    
    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : Error404
    content.innerHTML = await page.render();
    await page.after_render();
  
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);

const Utils = { 
    // --------------------------------
    //  Parse a url and break it into resource, id and verb
    // --------------------------------
    parseRequestURL : () => {

        let url = location.hash.slice(1).toLowerCase() || '/';
        let r = url.split("/")
        let request = {
            resource    : null,
            id          : null,
            verb        : null
        }
        request.resource    = r[1]
        request.id          = r[2]
        request.verb        = r[3]

        return request
    }

    // --------------------------------
    //  Simple sleep implementation
    // --------------------------------
    , sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let Navbar = {
    render: async () => {
        let view =  /*html*/`
        <div id="header_container">
        <nav class="navbar" role="navigation" aria-label="main navigation">
           <div class="container">
               <div class="navbar-brand">
                   <a class="navbar-item" href="Index.html#/">
                       <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
                   </a>

                   <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                       <span aria-hidden="true"></span>
                       <span aria-hidden="true"></span>
                       <span aria-hidden="true"></span>
                   </a>
               </div>

               <div id="navbarBasicExample" class="navbar-menu is-active" aria-expanded="false">
                   <div class="navbar-start">
                       <a class="navbar-item" href="Index.html#/">
                           Home
                       </a>
                       <a class="navbar-item" href="Index.html#/about">
                           About
                       </a>
                       <a class="navbar-item" href="Index.html#/secret">
                           Secret
                       </a>
                   </div>
                   <div class="navbar-end">
                       <div class="navbar-item">
                           <div class="buttons">
                               <a class="button is-primary" href="Index.html#/register">
                                   <strong>Sign up</strong>
                               </a>
                               <a class="button is-light" href="Index.html#/login">
                                   Log in
                               </a>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </nav>
   </div>
        `
        return view
    },
    after_render: async () => { }

}

let Bottombar = {
    render: async () => {
        let view =  /*html*/`
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    This is my foot. There are many like it, but this one is mine.
                </p>
            </div>
        </footer>
        `
        return view
    },
    after_render: async () => { }

}

let Register = {

    render: async () => {
        return /*html*/ `
            <section class="section">
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" id="email_input" type="email" placeholder="Enter your Email">
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" id="pass_input" type="password" placeholder="Enter a Password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" id="repeat_pass_input" type="password" placeholder="Enter the same Password again">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control">
                        <button class="button is-primary" id="register_submit_btn">
                        Register
                        </button>
                    </p>
                </div>

            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {
        document.getElementById("register_submit_btn").addEventListener ("click",  () => {
            let email       = document.getElementById("email_input");
            let pass        = document.getElementById("pass_input");
            let repeatPass  = document.getElementById("repeat_pass_input");
            if (pass.value != repeatPass.value) {
                alert (`The passwords dont match`)
            } else if (email.value =='' | pass.value == '' | repeatPass == '') {
                alert (`The fields cannot be empty`)
            } 
            else {
                alert(`User with email ${email.value} was successfully submitted!`)
            }    
        })
    }
}

// --------------------------------
//  Define Data Sources
// --------------------------------

let getPostsList = async () => {
    const options = {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json'
       }
   };
   try {
       const response = await fetch(`https://5bb634f6695f8d001496c082.mockapi.io/api/posts`, options)
       const json = await response.json();
       // console.log(json)
       return json
   } catch (err) {
       console.log('Error getting documents', err)
   }
}

let Error404 = {

    render : async () => {
        let view =  /*html*/`
            <section class="section">
                <h1> 404 Error </h1>
            </section>
        `
        return view
    }
    , after_render: async () => {
    }
}

let Login = {

    render: async () => {
        return /*html*/ `
            <section class="section">
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" id="email_input" type="email" placeholder="Enter your Email">
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" id="pass_input" type="password" placeholder="Enter a Password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <a href="Index.html#/register">
                    <strong>Don't have an account yet?</strong><br>
                </a>
                <div class="field">
                    <p class="control">
                        <a class="button is-primary" id="login_submit_btn">
                            <strong>Log in</strong>
                        </a>
                    </p>
                </div>

            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {
        document.getElementById("login_submit_btn").addEventListener ("click",  () => {
            let email       = document.getElementById("email_input");
            let pass        = document.getElementById("pass_input");
            if (email.value =='' | pass.value == '') {
                alert (`The fields cannot be empty`)
            } 
            else {
                window.location.href = "index.html#/";
                logged=true;
            }    
        })
    }
    
}

let getPost = async (id) => {
    const options = {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json'
       }
   };
   try {
       const response = await fetch(`https://5bb634f6695f8d001496c082.mockapi.io/api/posts/` + id, options)
       const json = await response.json();
       // console.log(json)
       return json
   } catch (err) {
       console.log('Error getting documents', err)
   }
}

let EditForm = {
    render : async () => {
        let view =  /*html*/`
        <form method="post" asp-page="Create">
        <div asp-validation-summary="ModelOnly" class="text-danger"></div>
        <div class="form-group">
            <label asp-for="User.UserName" class="control-label">Post Id: </label>
            <input asp-for="User.UserName" class="form-control" /><br>
            <span asp-validation-for="User.UserName" class="text-danger"></span>
        </div>
        <div class="form-group">
            <label asp-for="User.Password" class="control-label">Post title:</label>
            <input type="password" asp-for="User.Password" class="form-control" /><br>
            <span asp-validation-for="User.Password" class="text-danger"></span>
        </div>
        <div class="form-group">
            <label asp-for="User.ConfirmPwd" class="control-label">Post content:</label>
            <input asp-for="User.ConfirmPwd" type="password" class="form-control" /><br>
            <span asp-validation-for="User.ConfirmPwd" class="text-danger"></span>
        </div>
        <div class="form-group">
            <label asp-for="User.ConfirmPwd" class="control-label">Post author:</label>
            <input asp-for="User.ConfirmPwd" type="password" class="form-control" /><br>
            <span asp-validation-for="User.ConfirmPwd" class="text-danger"></span>
        </div>
        <div>
            <br> <input type="submit" value="Update" class="button is-primary"/>
        </div>
        </form>
        `
        return view
    }
    , after_render: async () => {
    }
}

let PostShow = {

    render : async () => {
        let request = Utils.parseRequestURL()
        let post = await getPost(request.id)
        
        return /*html*/`
            <section class="section">
                <h1> Post Id : ${post.id}</h1>
                <p> Post Title : ${post.title} </p>
                <p> Post Content : ${post.content} </p>
                <p> Post Author : ${post.name} </p>
                <a class="button is-primary" id="btn_edit">
                    <strong>Edit</strong>
                </a>
            </section>
        `
    }
    , after_render: async () => {
        var btn_edit_form= document.getElementById("btn_edit");
        btn_edit_form.onclick= function(){
            if(logged){
                window.location.href = "index.html#/editform";
            }else{
                alert(`You must be logged`)
            }
        }
    }
}

let About = {
    render : async () => {
        let view =  /*html*/`
            <section class="section">
                <h1> About </h1>
            </section>
        `
        return view
    },
    after_render: async () => {}
        
}

// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
    '/'             : Home
    , '/about'      : About
    , '/p/:id'      : PostShow
    , '/register'   : Register
    , '/editform'   : EditForm
    , '/login'      : Login
};


