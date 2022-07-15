var next=1,
starting_position,starting_position_left,starting_position_top,
ending_position,ending_position_left,ending_position_top,
top_difference,side_difference,distance=0,mouse=true,
counter=[],counter_key=0,current_position=0

for(let j=1,k=1;j<=2204;j+=77,k++){    
    for(let i=0;i<76;i++){  
        create_boxes(j+i)
        document.getElementById(`box-${j+i}`).style.top=`${(6+(k*3.1))}%`
        document.getElementById(`box-${j+i}`).style.left=`${0.5+(i*1.3)}%`
        counter[j+i]=0
    }
}

function create_boxes(index){
    const box=document.createElement("button")
    box.setAttribute("id",`box-${index}`)
    box.style.position="fixed"
    box.style.width="1.45%"
    box.style.height="3.5%"
    box.style.borderWidth="1px"
    box.style.borderColor="black"
    box.style.backgroundColor="white"
    box.style.display="flex"
    box.style.justifyContent="center"
    box.style.alignItems="center";
    document.getElementById("boxes").appendChild(box)
}

for(let j=1,k=1;j<=2204;j+=77,k++){    
    for(let i=0;i<76;i++){
        document.getElementById(`box-${j+i}`).addEventListener('click',e=>{
            e.preventDefault()
            if(next==1 && counter[j+i]==0){
                document.getElementById(`box-${j+i}`).innerHTML=`<i class="fas fa-angle-right" style="font-size:23px;"></i>`
                next=2
                starting_position=j+i
                starting_position_top=k
                starting_position_left=i
            }
            else if(next==2 && counter[j+i]==0){
                document.getElementById(`box-${j+i}`).innerHTML=`<i class="fas fa-angle-left" style="font-size:23px;"></i>`
                next=3
                document.getElementById("find").style.visibility="visible"
                ending_position=j+i
                ending_position_top=k
                ending_position_left=i
            }
            counter[j+i]++     
        })      
    }
}

document.addEventListener("mousedown",e=>{
    if(mouse==true)
        color_change("black")
    else
        color_change("white")
})

function color_change(color){
    for(let j=1,k=1;j<=2204;j+=77,k++){    
        for(let i=0;i<76;i++){
            document.getElementById(`box-${j+i}`).addEventListener('mouseover',e=>{
                e.preventDefault()
                if(next==3){
                    color=="white" 
                    ? document.getElementById(`box-${j+i}`).style.cursor="pointer" 
                    : document.getElementById(`box-${j+i}`).style.cursor="cell"
                    
                    document.getElementById(`box-${j+i}`).style.backgroundColor=color 
                    document.getElementById(`box-${j+i}`).style.borderColor="black" 
                    document.getElementById("build").style.visibility="visible" 
                    document.getElementById("erase").style.visibility="visible" 
                    document.getElementById("clear").style.visibility="visible"
                    // document.getElementById("path-finder").style.visibility="visible"
                }                
            })
            document.addEventListener("mouseup",e=>{
                i=77
                j=2210
            })
        }
    }
}

function build(){
    document.getElementById(`build`).style.color=`red`
    mouse=true
    document.getElementById(`erase`).style.color=`black`
}

function erase(){
    document.getElementById(`build`).style.color=`black`
    mouse=false
    document.getElementById(`erase`).style.color=`red`
}

function clear_wall(){
    distance=0
    document.getElementById("display-message").style.visibility="hidden"
    document.getElementById("display-distance").style.visibility="visible"
    document.getElementById("display-distance").innerHTML=""
    for(let j=1;j<=2204;j+=77){    
        for(let i=0;i<76;i++){  
            document.getElementById(`box-${j+i}`).style.backgroundColor="white"
            document.getElementById(`box-${j+i}`).style.borderColor="black"
        }
    }    
}

function path_finder(){
    top_difference=ending_position_top-starting_position_top
    side_difference=ending_position_left-starting_position_left
    side_difference<0
    ? left_movement(starting_position_top-1,starting_position_left+3,ending_position_left+1)
    : right_movement(starting_position_top-1,starting_position_left+1,ending_position_left+1)
}

function top_bottom_check(i,top,condition_1,condition_2){
    
    if(top_difference<0){
        output_1=up_movement(i-3,top+1,0)
        output_2=down_movement(i-3,top+1,30)
    }else{
        output_1=down_movement(i-3,top+1,30)
        output_2=up_movement(i-3,top+1,0)    
    }
    
    if(condition_1)
        output_1
    else if(condition_2) 
        output_2
    else
        document.getElementById("display-message").innerHTML="NO WAY FOUND"
}

function right_movement(top,loop_start,loop_end){
    
    for(let i=loop_start;i<=loop_end;i++){
        if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor!="black"){
            setTimeout(() =>{ 
                document.getElementById(`box-${(top*77)+i}`).style.backgroundColor="red"
                document.getElementById(`box-${(top*77)+i}`).style.borderColor="red" 
                document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"  
            }, (50*(++distance))); 
            
            side_difference=ending_position_left-i+1
            if(i==loop_end && top_difference!=0){
                top_difference<0
                ? up_movement(loop_end-2,top+1,ending_position_top-1)
                : down_movement(loop_end-2,top+1,ending_position_top-1)
            }
        }
        else if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor=="black" || side_difference==0){
            if(top_difference<0){
                if(boundary_check(i,0,top))
                up_movement(i-3,top+1,0)
                else if(boundary_check(i,top,28)) 
                down_movement(i-3,top+1,30)
                else{
                    document.getElementById("display-message").innerHTML="NO WAY FOUND"   
                    document.getElementById("display-distance").style.visibility="hidden"
                }
            }
            else if(top_difference>=0){
                if(boundary_check(i,top,28)) 
                down_movement(i-3,top+1,30)
                else if(boundary_check(i,0,top))
                up_movement(i-3,top+1,0)
                else{
                    document.getElementById("display-message").innerHTML="NO WAY FOUND"   
                    document.getElementById("display-distance").style.visibility="hidden"
                }
            }
        i=loop_end
        }
    }
}

function left_movement(top,loop_start,loop_end){
    
    loop_start-=2  
    for(let i=loop_start;i>=loop_end;i--){
        if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor!="black"){
            setTimeout(() =>{ 
                document.getElementById(`box-${(top*77)+i}`).style.backgroundColor="red"
                document.getElementById(`box-${(top*77)+i}`).style.borderColor="red" 
                document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"    
            }, (50*(++distance))); 
            
            side_difference=ending_position_left-i+1
            if(i==loop_end && top_difference!=0){
                top_difference<0
                ? up_movement(loop_end,top+1,ending_position_top-1)
                : down_movement(loop_end,top+1,ending_position_top-1)
            }
        }
        else if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor=="black" || side_difference==0){
            top_difference<0
            ?up_movement(i+1,top+1,0)
            :down_movement(i+1,top+1,30)
            i=loop_end
        }
    }
}

function up_movement(left,loop_start,loop_end){
    
    let add_or_sub
    if(ending_position_left-starting_position_left<0){
        left=left
        add_or_sub=-1 
    }
    else{
        left+=2
        add_or_sub=1
    }
    ending_position_top-starting_position_top==0 ? loop_end++ : loop_end
    loop_start-=2   
    for(let i=loop_start;i>=loop_end;i--){
        current_position=left+((i-1)*77)
        console.log(current_position)
        if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor!="black" || top_difference!=0){
            setTimeout(() => {
                document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor="red"
                document.getElementById(`box-${(left+(i*77))}`).style.borderColor="red"
                document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"
            }, (50*(++distance)));

            if(document.getElementById(`box-${(left+(side_difference<0 ?-1 :1)+(i*77))}`).style.backgroundColor!="black" && side_difference!=0 && side_difference!=-2){
                    side_difference<0
                    ?left_movement(i,side_difference<0 ? left+1 : left,ending_position_left+1)
                    :right_movement(i,side_difference<0 ? left+1 : left,ending_position_left+1)
                    break
            }

            top_difference=ending_position_top-i-1
            if(i==loop_end && side_difference!=-2 && top_difference==1){
                side_difference<0
                ?left_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left+1)
                :right_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left+1)
            }
        }
        
        else if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor=="black" || top_difference==0){
            side_difference<0
            ? left_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left) 
            : right_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left)
            break
        }

        if(document.getElementById(`box-${(current_position+add_or_sub)}`).style.backgroundColor!="white" && document.getElementById(`box-${(current_position-77)}`).style.backgroundColor!="white"){
            let top=i
            setTimeout(() => {
                current_position=current_position+(add_or_sub*-1)
                document.getElementById(`box-${(current_position)}`).style.backgroundColor="red"
                document.getElementById(`box-${(current_position)}`).style.borderColor="red"
                document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"
            }, (50*(++distance)));

            setTimeout(() => {
                while(document.getElementById(`box-${(current_position-77)}`).style.backgroundColor!="white"){
                    current_position=current_position+(add_or_sub*-1)
                    document.getElementById(`box-${(current_position)}`).style.backgroundColor="red"
                    document.getElementById(`box-${(current_position)}`).style.borderColor="red"
                    document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"
                }
            }, (50*(++distance)));
            setTimeout(() => up_movement(ending_position_left-starting_position_left<0 ? (current_position%77) :((current_position%77)-2),top,0), (50*(distance)));
        i=-10
        }
            
    }

}

function down_movement(left,loop_start,loop_end){
    let add_or_sub
    if(ending_position_left-starting_position_left<0){
        left=left
        add_or_sub=-1 
    }
    else{
        left+=2
        add_or_sub=1
    }
        
    for(let i=loop_start;i<=loop_end;i++){
        current_position=left+((i-1)*77)
        if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor!="black" || top_difference!=0){
            setTimeout(() => {
                document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor="red"
                document.getElementById(`box-${(left+(i*77))}`).style.borderColor="red"
                document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"
            }, (50*(++distance)));
            
            if(document.getElementById(`box-${(left+(side_difference<0 ?-1 :1)+(i*77))}`).style.backgroundColor!="black" && side_difference!=0 && side_difference!=1){
                    side_difference<0
                    ?left_movement(i,side_difference<0 ? left+1 : left,ending_position_left+1)
                    :right_movement(i,side_difference<0 ? left+1 : left,ending_position_left+1)
                    break
            }

            top_difference=ending_position_top-i-1
            if(i==loop_end && side_difference!=-2 && top_difference==1){
                side_difference<0
                ?left_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left+1)
                :right_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left+1)
            }
        }
        
        else if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor=="black" || top_difference==0){
            side_difference<0
            ? left_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left) 
            : right_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left)
            break
        }

        if(document.getElementById(`box-${(current_position+add_or_sub)}`).style.backgroundColor!="white" && document.getElementById(`box-${(current_position+77)}`).style.backgroundColor!="white"){
            let top=i
            setTimeout(() => {
                current_position=current_position+(add_or_sub*-1)
                document.getElementById(`box-${(current_position)}`).style.backgroundColor="red"
                document.getElementById(`box-${(current_position)}`).style.borderColor="red"
                document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"
            }, (50*(++distance)));

            setTimeout(() => {
                while(document.getElementById(`box-${(current_position+77)}`).style.backgroundColor!="white"){
                    current_position=current_position+(add_or_sub*-1)
                    document.getElementById(`box-${(current_position)}`).style.backgroundColor="red"
                    document.getElementById(`box-${(current_position)}`).style.borderColor="red"
                    document.getElementById("display-distance").innerHTML="Distance:"+distance+" Units"
                }
            }, (50*(++distance)));
            setTimeout(() => down_movement(ending_position_left-starting_position_left<0 ? (current_position%77) :((current_position%77)-2),top,30), (50*(distance)));
        i=loop_end
        }    
    }

}

function boundary_check(left,loop_start,loop_end){
    let counter=-1
    for(let i=loop_start;i<=loop_end;i++){
        if(document.getElementById(`box-${(i*77)+left}`).style.backgroundColor=="black")
        counter++
    }
    if(counter==(loop_end-loop_start))
    return false
    else
    return true
}

/*

function path_finder(){
    top_difference=ending_position_top-starting_position_top
    side_difference=ending_position_left-starting_position_left
    side_difference<0
    ? left_movement(starting_position_top-1,starting_position_left+2,ending_position_left)
    : right_movement(starting_position_top-1,starting_position_left+2,ending_position_left)
}

function right_movement(top,loop_start,loop_end){
    
    if(side_difference==0)
        loop_start-=2
    for(let i=loop_start;i<=loop_end;i++){
        if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor!="black" && side_difference!=0){
            setTimeout(() =>{ 
                document.getElementById(`box-${(top*77)+i}`).style.backgroundColor="red"
                document.getElementById(`box-${(top*77)+i}`).style.borderColor="red"    
            }, (50*(++distance))); 
            
            side_difference=ending_position_left-i
            if(i==loop_end && top_difference!=1){
                top_difference<0
                ? up_movement(loop_end-2,top+1,ending_position_top-1)
                : down_movement(loop_end-2,top+1,ending_position_top-1)
            }
        }
        else if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor=="black" || side_difference==0){
            top_difference<0
            ?up_movement(i-1,top+1,ending_position_top-1)
            :down_movement(i-1,top+1,ending_position_top-1)
            i=loop_end
        }
    }
}

function left_movement(top,loop_start,loop_end){
    
    loop_start-=2
    loop_end=ending_position_left+2    

    for(let i=loop_start;i>=loop_end;i--){
        if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor!="black" && side_difference!=0){
            setTimeout(() =>{ 
                document.getElementById(`box-${(top*77)+i}`).style.backgroundColor="red"
                document.getElementById(`box-${(top*77)+i}`).style.borderColor="red"    
            }, (50*(++distance))); 
            
            side_difference=ending_position_left-i
            if(i==loop_end && top_difference!=1){
                top_difference<0
                ? up_movement(loop_end,top+1,ending_position_top-1)
                : down_movement(loop_end,top+1,ending_position_top-1)
            }
        }
        else if(document.getElementById(`box-${(top*77)+i}`).style.backgroundColor=="black" || side_difference==0){
            top_difference<0
            ?up_movement(i+1,top+1,ending_position_top-1)
            :down_movement(i+1,top+1,ending_position_top-1)
            i=loop_end
        }
    }
}

function up_movement(left,loop_start,loop_end){
    
    side_difference==0 ? left+=2 : left
    ending_position_left-starting_position_left==0 ? loop_end-- : loop_end
    loop_start-=2
    loop_end=ending_position_top-1    
        
    for(let i=loop_start;i>=loop_end;i--){
        if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor!="black" || top_difference!=0){
            setTimeout(() => {
                document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor="red"
                document.getElementById(`box-${(left+(i*77))}`).style.borderColor="red"
            }, (50*(++distance)));

            if(document.getElementById(`box-${(left+(side_difference<0 ?-1 :1)+(i*77))}`).style.backgroundColor!="black" && side_difference!=0 && side_difference!=-2){
                    side_difference<0
                    ?left_movement(i,side_difference<0 ? left+1 : left,ending_position_left)
                    :right_movement(i,side_difference<0 ? left+1 : left,ending_position_left)
                    break
            }

            top_difference=ending_position_top-i-2
            if(i==loop_end && side_difference!=-2 && top_difference==1){
                side_difference<0
                ?left_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left)
                :right_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left)
            }
        }
        
        else if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor=="black" || top_difference==0){
            side_difference<0
            ? left_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left) 
            : right_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left)
            break
        }
            
    }

}

function down_movement(left,loop_start,loop_end){
    
    side_difference==0 ? left+=2 : left
    ending_position_left-starting_position_left==0 ? loop_end-- : loop_end     
        
    for(let i=loop_start;i<=loop_end;i++){
        if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor!="black" || top_difference!=0){
            setTimeout(() => {
                document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor="red"
                document.getElementById(`box-${(left+(i*77))}`).style.borderColor="red"
            }, (50*(++distance)));
            
            if(document.getElementById(`box-${(left+(side_difference<0 ?-1 :1)+(i*77))}`).style.backgroundColor!="black" && side_difference!=0 && side_difference!=1){
                    side_difference<0
                    ?left_movement(i,side_difference<0 ? left+1 : left,ending_position_left)
                    :right_movement(i,side_difference<0 ? left+1 : left,ending_position_left)
                    break
            }

            top_difference=ending_position_top-i
            if(i==loop_end && side_difference!=-2 && top_difference==1){
                side_difference<0
                ?left_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left)
                :right_movement(loop_end,side_difference<0 ? left+1 : left,ending_position_left)
            }
        }
        
        else if(document.getElementById(`box-${(left+(i*77))}`).style.backgroundColor=="black" || top_difference==0){
            side_difference<0
            ? left_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left) 
            : right_movement(ending_position_top-starting_position_top<0? i+1 : i-1,left+1,ending_position_left)
            break
        }
            
    }

}



*/ 
