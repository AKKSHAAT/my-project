TODO: history shows time 


parchi 
    Card_id -> parchi has one card, card belongs to parchi
    qty 
    price
    rep_id
    date



    cards= [
        {
            id:1,
            qty: 22,
            cost: 242
        },
        {
            id:8,
            qty: 5,
            cost: 55
        }
    ]

    total = 297


    ##comaand
        a button in footer.jsx
            `<button
                    className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none  translate-color duration-300 border`}
                >
                    Parchi
            </button>`

            should post to `/parchi`

            but the data it will post is in 
