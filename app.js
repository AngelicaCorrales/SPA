const routes={
    '/': Home
    , '/about': About
    ,'/p/:id' : PostShow
    , '/register': Regsiter
};

const router= async()=>{
    const content=null || document.getElementById('page_container');

    let request=Utils.parseRequesrURL()

    let parseURL=(request.resource?'/'+request.resource:'/')+(request.id?'/:id':'')+(request.verb?'/'+request.verb:'')

    let page= routes[parseURL]? routes[parseURL]:Error404
    content.innerHTML=await page.render();
    await page.after_render();
}

window.addEventListener('hashchange',router);

window.addEventListener('load', router);



