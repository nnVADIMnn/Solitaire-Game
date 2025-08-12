function Desk(){

    let deck = new Array(36)
    let stacks = new Array(12)
    let throwed = new Array(4)
    let selected_stack = -1
    let parent = document.body

    function Restart(){
        deck = new Array(36)
        stacks = new Array(12)
        throwed = new Array(4)
        selected_stack = -1
        for(let i = 0; i < 12; i++){
            stacks[i] = new Array(4)
        }
        while (desk_element.firstChild) {
            desk_element.removeChild(desk_element.lastChild);
        }
        Toss()
    }

    function VictoryCheck(){
        if (throwed[0] + throwed[1] + throwed[2] + throwed[3] == 90){
            alert("Victory!")
            Restart()
        }
    }

    function Swap(index1, index2){
        if(index1 != index2){
            deck[index1] += deck[index2]
            deck[index2] = deck[index1] - deck[index2]
            deck[index1] = deck[index1] - deck[index2]
        }
    }

    function Lay(){
        console.log("laying...")
        for(let i = 0; i < 12; i++){
            stacks[i][0] = 3
            stacks[i][1] = deck[i * 3]
            stacks[i][2] = deck[i * 3 + 1]
            stacks[i][3] = deck[i * 3 + 2]
        }
        throwed[0] = 0
        throwed[1] = 9
        throwed[2] = 18
        throwed[3] = 27
        console.log("the desk is ready!")
        console.log("choose the stack to take from!")
    }

    function SelectThrow(e){
        let suit = Array.from(e.target.parentElement.parentElement.children).indexOf(e.target.parentElement)
        let selected_card = document.querySelector(".card_selected")
        if(selected_stack != -1){
            if(Math.floor(throwed[suit] / 9) == suit && stacks[selected_stack][stacks[selected_stack][0]] == throwed[suit]){
                e.target.src = selected_card.src
                selected_card.remove()
                throwed[suit] += 1
                stacks[selected_stack][stacks[selected_stack][0]] = -1
                stacks[selected_stack][0] -= 1
                console.log("card", stacks[selected_stack][stacks[selected_stack][0]], "was throwed from stack", selected_stack, "to", suit)
                console.log("new stacks' values:")
                console.log("stack:", stacks[selected_stack])
                console.log("suit:", throwed[suit])
                VictoryCheck()
            }
            else{
                console.log("can't throw from stack", selected_stack, "(card", stacks[selected_stack][stacks[selected_stack][0]], ") to suit", suit, "( card", throwed[suit], ")")
                selected_card.classList.remove("card_selected")
                selected_card.classList.add("card")
            }
            selected_stack = -1
        }
        console.log(selected_stack)
    }

    function DeactivateCard(){
        let active_card = document.querySelector(".card_selected")
        if(active_card){
            active_card.classList.remove("card_selected")
            active_card.classList.add("card")
        }
    }

    function ActivateCard(card){
        let new_active_card = card.parentElement.children[card.parentElement.children.length - 1]
        if(new_active_card.classList[0] == "card"){
            DeactivateCard()
            new_active_card.classList.add("card_selected")
            new_active_card.classList.remove("card")
        }
        else{  
            new_active_card.classList.add("card")
            new_active_card.classList.remove("card_selected")
        }
    }

    function Take(stack2, stack_element){
        if(stacks[stack2][0] == 3){
            console.log("stack", stack2, "is full!")
            return false
        }
        if(stacks[stack2][0] == 0){
            console.log("stack", stack2, "is empty!")
            return false
        }
        if(stacks[selected_stack][stacks[selected_stack][0]] % 9 != stacks[stack2][stacks[stack2][0]] % 9){
            console.log("stack", stack2, "isn't compatible!")
            return false
        }
        DrawCard(stacks[selected_stack][stacks[selected_stack][0]], stacks[stack2][0] + 1, stack_element)
        stacks[stack2][0] += 1
        stacks[stack2][stacks[stack2][0]] = stacks[selected_stack][stacks[selected_stack][0]]
        stacks[selected_stack][stacks[selected_stack][0]] = -1
        stacks[selected_stack][0] -= 1
        document.querySelector(".card_selected").remove()
        console.log("card", stacks[selected_stack][stacks[selected_stack][0]], "was taken from stack", selected_stack, "to", stack2)
        console.log("new stacks' values:")
        console.log("stack 1:", stacks[selected_stack])
        console.log("stack 2:", stacks[stack2])
        return true
    }

    function SelectStack(e){
        if(e.target.classList[0] !== "stack"){
            let stack = Array.from(e.target.parentElement.parentElement.children).indexOf(e.target.parentElement)
            if(selected_stack == -1){
                selected_stack = stack
                ActivateCard(e.target)
            }
            else{
                if(stack != selected_stack){
                    if(!Take(stack, e.target.parentElement)){
                        DeactivateCard()
                    }          
                }
                else{
                    DeactivateCard()
                }
                selected_stack = -1
            }
            console.log(selected_stack)
        }
    }

    function DrawCard(value, card_index, stack_element){
        let suits = {"spades":9, "diamonds":18, "cross":27, "hearts":36}
        let vals = ['A', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        let suit = ""
        let val = ""
        for(let i in suits){
            if(value < suits[i]){
                suit = i
                val = vals[value - suits[i] + 9]
                break
            }
        }
        let card = document.createElement("img")
        card.src = `./resources/${suit}/${suit + val}.png`
        card.classList.add("card")
        card.style.left = `${(card_index - 1) * 20}%`
        stack_element.appendChild(card)
    }

    function DrawStacks(stacks_area){
        for(let i = 0; i < 12; i++){
            let stack_element = document.createElement('div')
            stack_element.classList.add('stack')
            stacks_area.appendChild(stack_element)
            for(let j = 1; j < 4; j++){
                DrawCard(stacks[i][j], j, stack_element)
            }
            stack_element.onclick = function(e){SelectStack(e)}
        }
    }

    function DrawThrow(throw_area){
        let suits = ["spades", "diamonds", "cross", "hearts"]
        for(let i in suits){
            let stack_element = document.createElement('div')
            stack_element.classList.add('stack')
            throw_area.appendChild(stack_element)
            let suit_element = document.createElement('img')
            suit_element.classList.add("throw")
            suit_element.src = `./resources/${suits[i]}/${suits[i]}E.png`
            suit_element.onclick = function(e){SelectThrow(e)}
            stack_element.appendChild(suit_element)
        }
    }

    function DrawDesk(){
        let desk_element = document.createElement("div")
        desk_element.classList.add('desk')
        parent.appendChild(desk_element)
        let throw_area = document.createElement("div")
        throw_area.classList.add('throw_area')
        desk_element.appendChild(throw_area)
        let stacks_area = document.createElement("div")
        stacks_area.classList.add('stacks_area')
        desk_element.appendChild(stacks_area)
        DrawThrow(throw_area)
        DrawStacks(stacks_area)
        return desk_element
    }

    function Testing(){
        for(let i = 0; i < 36; i++){
            deck[i] = 35 - i
        }
    }

    function Toss(){
        console.log("tossing...")
        for(let i = 0; i < 36; i++){
            deck[i] = i
        }
        for(let i = 0; i < 36; i++){
            let index = Math.floor(Math.random() * 36)
            Swap(i, index)
        }
        //
        //Testing()
        //
        Lay()
        return DrawDesk()
    }

    function OnStart(){
        alert(`Rules:\n
            - The Goal: Clear out all stacks by stacking all cards by suits (A, 6, 7, ..., K)\n
            - Replacing cards between stacks rules:\n
            -- No more then 3 cards per stack\n
            -- You can place a card only on a card with the same value`)
    }

    for(let i = 0; i < 12; i++){
        stacks[i] = new Array(4)
    }
    let desk_element = Toss()
    OnStart()

}
