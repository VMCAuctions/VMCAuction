function countMoves(numbers) {
    var done = false;
    var counter = 0;
    while (done === false){
        done = true;
        var max = numbers[0];
        var maxIndex = 0;
        for (var i = 1; i < numbers.length; i++){
            if (numbers[i] > max){
                max = numbers[i];
                maxIndex = i;
            }
            if (numbers[i] != max){
                done = false;
            }
        }
        if (done === true){
            break;
        }
        for (var j = 0; j < numbers.length; j++){
            if (j != maxIndex){
                numbers[j] += 1;
            }
        }
        console.log("on iteration " + counter + ", numbers is:")
        console.log(numbers)
        counter += 1;
    }
    return counter;
}

countMoves([5, 5, 5, 6, 8, 5])
