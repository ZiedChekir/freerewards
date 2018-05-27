function sortByHeight(a) {
    var j = 0
    var swap = 0
for(var i = 0;i < a.length;i ++){
        // console.log(i)
            for(var k = j; k < a.length; k++){
                console.log(k)
                   if(a[k] != -1){
                if(a[i] > a[k]  ) {
                    swap = a[i]
                    a[i] = a[k]
                    a[k] = swap              
                }
              
            }
                  
                }
            j++
      
    }
     return a
}

    

sortByHeight([-1, 150, 190, 170, -1, -1, 160, 180])