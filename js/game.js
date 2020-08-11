/*
 * 15Puzzle
 */

$(function () {
    FastClick.attach(document.body);
});

(function () {

    var grid = document.getElementById('grid');
    var start = false;
    var moves = 0;
    var state = 1;
    var gameStatus = false;
    var secPassed = 0;          // Seconds since the game started
    var hour = 0;
    var min = 0;
    var sec = 0;
    var timer = undefined;

    solve();

    // Timer    
    function startTimer() {
        if (!gameStatus) {
            gameStatus = true;
            timer = setInterval(setTime, 1000);
        }
    }
    function stopTimer() {
        gameStatus = false;
        clearInterval(timer);
    }
    function setTime() {
        var remainingTime = ++secPassed;
        hour = parseInt(remainingTime / 3600);
        document.querySelector('.hours').textContent = timeToString(hour);
        remainingTime = remainingTime % 3600;
        min = parseInt(remainingTime / 60)
        document.querySelector('.mins').textContent = timeToString(min);
        remainingTime = remainingTime % 60;
        sec = remainingTime;
        document.querySelector('.seconds').textContent = timeToString(sec);
    }
    // Convert hours, minutes and seconds into string
    function timeToString(t) {
        var tString = t + '';
        return tString.length >= 2 ? `${t}` : `0${t}`;
    }

    // Listen for a click in the cells of the grid
    grid.addEventListener('click', function (e) {
        startTimer();
        if (start) {
            grid.className = 'transition'; // Enable cell movement animation
            shiftCell(e.target);
            moves++;
        }
    });

    // Buttons Solve & Reset
    document.getElementById('solve').addEventListener('click', solve);
    document.getElementById('reset').addEventListener('click', reset);

    function solve() {
        start = false;
        if (state == 0) {
            return;
        }
        grid.innerHTML = '';
        var n = 1;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var cell = document.createElement('span');
                cell.id = 'cell-' + i + '-' + j;
                cell.style.left = (j * 95 + 1 * j + 1) + 'px';
                cell.style.top = (i * 95 + 1 * i + 1) + 'px';
                if (n <= 15) {
                    cell.classList.add('number');
                    cell.classList.add((i % 2 == 0 && j % 2 > 0 || i % 2 > 0 && j % 2 == 0) ? 'dark' : 'light');
                    cell.innerHTML = (n++).toString();
                } else {
                    cell.className = 'empty';
                }
                grid.appendChild(cell);
            }
        }
    }

    function shiftCell(cell) {
        if (cell.clasName != 'empty') {
            var emptyCell = getEmptyAdjacentCell(cell);
            if (emptyCell) {
                var tmp = { style: cell.style.cssText, id: cell.id }; // Temporary data
                cell.style.cssText = emptyCell.style.cssText;
                cell.id = emptyCell.id;
                emptyCell.style.cssText = tmp.style;
                emptyCell.id = tmp.id;
                if (state == 1) {
                    checkOrder(); 
                }
            }
        }
    }

    function getCell(row, col) {
        return document.getElementById('cell-' + row + '-' + col);
    }

    function getEmptyCell() {
        return grid.querySelector('.empty');
    }

    function getEmptyAdjacentCell(cell) {
        var adjacent = getAdjacentCells(cell); 
        for (var i = 0; i < adjacent.length; i++) {
            if (adjacent[i].className == 'empty') {
                return adjacent[i];
            }
        }
        return false;
    }

    function getAdjacentCells(cell) {
        var id = cell.id.split('-');
        var row = parseInt(id[1]);
        var col = parseInt(id[2]);
        var adjacent = [];
        if (row < 3) {
            adjacent.push(getCell(row + 1, col));
        }
        if (row > 0) {
            adjacent.push(getCell(row - 1, col));
        }
        if (col < 3) {
            adjacent.push(getCell(row, col + 1));
        }
        if (col > 0) {
            adjacent.push(getCell(row, col - 1));
        }
        return adjacent;
    }

    function checkOrder() {
        if (getCell(3, 3).className != 'empty') {
            return;
        }
        var n = 1;
        for (var i = 0; i <= 3; i++) {
            for (var j = 0; j <= 3; j++) {
                if (n <= 15 && getCell(i, j).innerHTML != n.toString()) {
                    return;
                }
                n++;
            }
        }
        win();
    }

    function win() {
        stopTimer();
        openModal();
        state = 0;
    }

    // Shuffle
    function reset() {
        closeModal();
        grid.removeAttribute('class');
        start = true;
        moves = 0;
        var previousCell;
        var i = 1;
        var interval = setInterval(function () {
            if (i <= 100) {
                var adjacent = getAdjacentCells(getEmptyCell());
                if (previousCell) {
                    for (var j = adjacent.length - 1; j >= 0; j--) {
                        if (adjacent[j].innerHTML == previousCell.innerHTML) {
                            adjacent.splice(j, 1);
                        }
                    }
                }
                previousCell = adjacent[mix(0, adjacent.length - 1)];
                shiftCell(previousCell);
                i++;
            } else {
                clearInterval(interval);
                state = 1;
            }
        }, 5);
    }

    // Random numbers
    function mix(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    // Modal
    var modal = document.querySelector('.modal');

    var close = document.querySelector('.close-modal');
    var playAgain = document.querySelector('.play-again');
    close.addEventListener('click', closeModal);
    playAgain.addEventListener('click', reset);

    var movesCount = document.querySelector('.moves');

    function openModal() {
        document.querySelector('.modal .hours').textContent = hour > 0 ? `${hour} h ` : '';
        document.querySelector('.modal .mins').textContent = min > 0 ? `${min} min and` : '';
        document.querySelector('.modal .seconds').textContent = `${sec} sec`;
        movesCount.textContent = moves;
        modal.style.display = 'block';
    }
    function closeModal() {
        modal.style.display = 'none';
    }

})();
