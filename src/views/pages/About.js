let About={
    render: async()=>{
        let view=/*html*/`
        <section class="section>
            <h1> about</h1>
        </section>
        `
        return view
    },
    after_render: async() =>{
        document.getElementById("myBtn").addEventListener("click", () =>{
            console.log('Yo')
            alert('Yo')
        })
    }
}

export default About;