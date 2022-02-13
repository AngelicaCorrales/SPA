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


