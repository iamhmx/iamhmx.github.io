// ========================================
// 数独游戏 - 第九届重庆数学文化节
// ========================================

class SudokuGame {
    constructor() {
        this.currentType = 'standard6';
        this.boardSize = 6;
        this.board = [];
        this.solution = [];
        this.selectedCell = null;
        this.puzzleData = {};
        this.highlightEnabled = false;
        this.history = []; // 操作历史栈，用于撤销
        this.timerInterval = null; // 计时器定时器
        this.startTime = null; // 游戏开始时间
        this.elapsedSeconds = 0; // 已用秒数
        
        this.typeConfigs = {
            standard6: {
                name: '六宫标准数独',
                size: 6,
                boxRows: 2,
                boxCols: 3,
                rule: '在空格内填入数字1-6，使每行、每列、每宫的数字均不重复。'
            },
            standard9: {
                name: '九宫标准数独',
                size: 9,
                boxRows: 3,
                boxCols: 3,
                rule: '在空格内填入数字1-9，使每行、每列、每宫的数字均不重复。'
            },
            irregular7: {
                name: '七宫不规则数独',
                size: 7,
                rule: '将数字1-7填入空格内，使每行、每列及每个不规则粗线宫内数字均不重复。'
            }
        };

        // 预定义的谜题库
        this.puzzleLibrary = {
            standard6: [
                {
                    puzzle: [
                        [0, 0, 0, 5, 0, 2],
                        [0, 5, 0, 0, 4, 0],
                        [0, 0, 0, 6, 0, 5],
                        [5, 0, 1, 0, 0, 0],
                        [0, 4, 0, 0, 2, 0],
                        [3, 0, 6, 0, 0, 0]
                    ],
                    solution: [
                        [4, 1, 3, 5, 6, 2],
                        [6, 5, 2, 1, 4, 3],
                        [2, 3, 4, 6, 1, 5],
                        [5, 6, 1, 2, 3, 4],
                        [1, 4, 5, 3, 2, 6],
                        [3, 2, 6, 4, 5, 1]
                    ]
                }
            ],
            standard9: [
                {
                    puzzle: [
                        [4, 2, 0, 0, 0, 0, 0, 7, 0],
                        [6, 0, 8, 9, 0, 7, 0, 0, 0],
                        [0, 0, 0, 5, 0, 0, 8, 3, 0],
                        [0, 1, 0, 0, 9, 0, 2, 0, 4],
                        [8, 0, 0, 2, 0, 4, 0, 0, 3],
                        [2, 0, 9, 0, 1, 0, 0, 6, 0],
                        [0, 7, 1, 0, 0, 9, 0, 0, 0],
                        [0, 0, 0, 1, 0, 2, 3, 0, 7],
                        [0, 6, 0, 0, 0, 0, 0, 8, 1]
                    ],
                    solution: [
                        [4, 2, 5, 8, 3, 1, 6, 7, 9],
                        [6, 3, 8, 9, 2, 7, 1, 4, 5],
                        [1, 9, 7, 5, 4, 6, 8, 3, 2],
                        [7, 1, 3, 6, 9, 8, 2, 5, 4],
                        [8, 5, 6, 2, 7, 4, 9, 1, 3],
                        [2, 4, 9, 3, 1, 5, 7, 6, 8],
                        [3, 7, 1, 4, 8, 9, 5, 2, 6],
                        [5, 8, 4, 1, 6, 2, 3, 9, 7],
                        [9, 6, 2, 7, 5, 3, 4, 8, 1]
                    ]
                }
            ],
            irregular7: [
                {
                    puzzle: [
                        [6, 4, 0, 5, 3, 0, 0],
                        [0, 0, 7, 0, 1, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [0, 2, 6, 1, 0, 7, 0],
                        [0, 0, 0, 0, 0, 0, 0],
                        [1, 0, 0, 4, 6, 0, 0],
                        [0, 0, 0, 0, 0, 6, 0]
                    ],
                    solution: [
                        [6, 4, 1, 5, 3, 2, 7],
                        [4, 5, 7, 2, 1, 3, 6],
                        [5, 3, 2, 6, 7, 1, 4],
                        [3, 2, 6, 1, 4, 7, 5],
                        [7, 6, 5, 3, 2, 4, 1],
                        [1, 7, 3, 4, 6, 5, 2],
                        [2, 1, 4, 7, 5, 6, 3]
                    ],
                    // 不规则区域定义 - 根据图片中的粗线
                    regions: [
                        [0, 0, 0, 0, 0, 0, 1],
                        [2, 2, 0, 1, 1, 1, 1],
                        [3, 2, 2, 2, 2, 2, 1],
                        [3, 3, 3, 3, 3, 3, 1],
                        [4, 4, 4, 4, 4, 4, 5],
                        [4, 6, 6, 6, 6, 6, 5],
                        [6, 6, 5, 5, 5, 5, 5]
                    ]
                }
            ]
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.startNewGame();
    }

    bindEvents() {
        // Type selection buttons
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentType = e.target.dataset.type;
                this.startNewGame();
            });
        });

        // Control buttons
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('refreshBtn').addEventListener('click', () => this.startNewGame());
        document.getElementById('checkBtn').addEventListener('click', () => this.checkSolution());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearUserInput());
        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) hintBtn.addEventListener('click', () => this.giveHint());
        document.getElementById('closeMessage').addEventListener('click', () => this.hideMessage());
        const highlightToggle = document.getElementById('highlightToggle');
        if (highlightToggle) highlightToggle.addEventListener('click', () => this.toggleHighlight());

        // Keyboard input
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startNewGame() {
        const config = this.typeConfigs[this.currentType];
        this.boardSize = config.size;
        this.puzzleData = {};
        
        // Update rule description
        document.getElementById('ruleDescription').textContent = config.rule;
        
        // Load puzzle from library
        this.loadPuzzle();
        
        // Render the board
        this.renderBoard();
        
        // Update number pad
        this.updateNumberPad();
        
        // Clear selection and history
        this.selectedCell = null;
        this.history = [];
        
        // 启动计时器
        this.startTimer();
    }

    // 计时器方法
    startTimer() {
        this.stopTimer();
        this.elapsedSeconds = 0;
        this.updateTimerDisplay();
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const seconds = this.elapsedSeconds % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const timerEl = document.getElementById('timerDisplay');
        if (timerEl) timerEl.textContent = display;
    }

    formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes > 0) {
            return `${minutes}分${seconds}秒`;
        }
        return `${seconds}秒`;
    }

    loadPuzzle() {
        const config = this.typeConfigs[this.currentType];
        
        // 对于有boxRows/boxCols的标准数独，随机生成新题
        if (config.boxRows && config.boxCols) {
            this.generateNewPuzzle(config);
            return;
        }
        
        // 对于不规则数独，使用预定义的谜题库
        const puzzles = this.puzzleLibrary[this.currentType];
        if (puzzles && puzzles.length > 0) {
            const puzzleIndex = Math.floor(Math.random() * puzzles.length);
            const puzzleData = puzzles[puzzleIndex];
            
            this.board = puzzleData.puzzle.map(row => [...row]);
            this.solution = puzzleData.solution;
            
            if (puzzleData.regions) {
                this.puzzleData.regions = puzzleData.regions;
            }
        }
    }

    generateNewPuzzle(config) {
        const size = config.size;
        const { boxRows, boxCols } = config;
        
        // 生成完整的有效数独解
        this.solution = this.generateValidSudoku(size, boxRows, boxCols);
        
        // 根据大小决定挖空数量（保持合适的难度）
        let cellsToRemove;
        if (size === 6) {
            cellsToRemove = 24; // 36格中尝试挖掉24格，目标留12-13个提示数
        } else if (size === 9) {
            cellsToRemove = 45; // 81格中挖掉45格，留36个提示数
        } else {
            cellsToRemove = Math.floor(size * size * 0.55);
        }
        
        this.board = this.createPuzzleFromSolution(this.solution, cellsToRemove);
    }

    generateValidSudoku(size, boxRows, boxCols) {
        const board = Array(size).fill(null).map(() => Array(size).fill(0));
        this.fillSudoku(board, size, boxRows, boxCols);
        return board;
    }

    fillSudoku(board, size, boxRows, boxCols) {
        const findEmpty = () => {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) return [i, j];
                }
            }
            return null;
        };

        const isValid = (num, row, col) => {
            if (board[row].includes(num)) return false;
            for (let i = 0; i < size; i++) {
                if (board[i][col] === num) return false;
            }
            const boxStartRow = Math.floor(row / boxRows) * boxRows;
            const boxStartCol = Math.floor(col / boxCols) * boxCols;
            for (let i = boxStartRow; i < boxStartRow + boxRows; i++) {
                for (let j = boxStartCol; j < boxStartCol + boxCols; j++) {
                    if (board[i][j] === num) return false;
                }
            }
            return true;
        };

        const solve = () => {
            const empty = findEmpty();
            if (!empty) return true;
            const [row, col] = empty;
            const nums = this.shuffleArray([...Array(size)].map((_, i) => i + 1));
            for (const num of nums) {
                if (isValid(num, row, col)) {
                    board[row][col] = num;
                    if (solve()) return true;
                    board[row][col] = 0;
                }
            }
            return false;
        };

        solve();
        return board;
    }

    createPuzzleFromSolution(solution, cellsToRemove) {
        const size = solution.length;
        const config = this.typeConfigs[this.currentType];
        const boxRows = config.boxRows;
        const boxCols = config.boxCols;
        const puzzle = solution.map(row => [...row]);
        const positions = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                positions.push([i, j]);
            }
        }
        this.shuffleArray(positions);
        
        let removed = 0;
        for (const [row, col] of positions) {
            if (removed >= cellsToRemove) break;
            
            const backup = puzzle[row][col];
            puzzle[row][col] = 0;
            
            // 检查挖空后是否仍然唯一解
            if (this.countSolutions(puzzle, size, boxRows, boxCols) !== 1) {
                // 多解或无解，恢复
                puzzle[row][col] = backup;
            } else {
                removed++;
            }
        }
        
        return puzzle;
    }

    // 计算数独解的数量（最多数到2就返回，用于判断唯一性）
    countSolutions(puzzle, size, boxRows, boxCols) {
        const board = puzzle.map(row => [...row]);
        let count = 0;

        const findEmpty = () => {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] === 0) return [i, j];
                }
            }
            return null;
        };

        const isValid = (num, row, col) => {
            for (let j = 0; j < size; j++) {
                if (j !== col && board[row][j] === num) return false;
            }
            for (let i = 0; i < size; i++) {
                if (i !== row && board[i][col] === num) return false;
            }
            const boxStartRow = Math.floor(row / boxRows) * boxRows;
            const boxStartCol = Math.floor(col / boxCols) * boxCols;
            for (let i = boxStartRow; i < boxStartRow + boxRows; i++) {
                for (let j = boxStartCol; j < boxStartCol + boxCols; j++) {
                    if (i === row && j === col) continue;
                    if (board[i][j] === num) return false;
                }
            }
            return true;
        };

        const solve = () => {
            if (count >= 2) return; // 已经发现多解，提前终止
            const empty = findEmpty();
            if (!empty) {
                count++;
                return;
            }
            const [row, col] = empty;
            for (let num = 1; num <= size; num++) {
                if (isValid(num, row, col)) {
                    board[row][col] = num;
                    solve();
                    if (count >= 2) return; // 提前终止
                    board[row][col] = 0;
                }
            }
        };

        solve();
        return count;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ========================================
    // Rendering
    // ========================================

    renderBoard() {
        const boardEl = document.getElementById('sudokuBoard');
        boardEl.innerHTML = '';
        boardEl.style.display = '';
        
        // Reset board element styles, preserve no-highlight state
        boardEl.className = `sudoku-board size-${this.boardSize}`;
        if (!this.highlightEnabled) {
            boardEl.classList.add('no-highlight');
        }
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                const value = this.board[i][j];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add('fixed');
                }
                
                // Add box borders based on sudoku type
                this.addBoxBorders(cell, i, j);
                
                cell.addEventListener('click', () => this.selectCell(cell, i, j));
                boardEl.appendChild(cell);
            }
        }
    }

    addBoxBorders(cell, row, col) {
        const config = this.typeConfigs[this.currentType];
        
        if (this.currentType === 'irregular7') {
            this.addRegionBorders(cell, row, col);
            return;
        }
        
        if (!config.boxRows || !config.boxCols) return;
        
        const { boxRows, boxCols } = config;
        
        // Right border of box
        if ((col + 1) % boxCols === 0 && col < this.boardSize - 1) {
            cell.classList.add('box-right');
        }
        
        // Bottom border of box
        if ((row + 1) % boxRows === 0 && row < this.boardSize - 1) {
            cell.classList.add('box-bottom');
        }
    }

    addRegionBorders(cell, row, col) {
        if (!this.puzzleData.regions) return;
        
        const regions = this.puzzleData.regions;
        const currentRegion = regions[row][col];
        const size = this.boardSize;
        
        // Add region color
        cell.classList.add(`region-${currentRegion + 1}`);
        
        // Add borders where regions differ
        if (row > 0 && regions[row - 1][col] !== currentRegion) {
            cell.classList.add('region-border-top');
        }
        if (row < size - 1 && regions[row + 1][col] !== currentRegion) {
            cell.classList.add('region-border-bottom');
        }
        if (col > 0 && regions[row][col - 1] !== currentRegion) {
            cell.classList.add('region-border-left');
        }
        if (col < size - 1 && regions[row][col + 1] !== currentRegion) {
            cell.classList.add('region-border-right');
        }
    }

    updateNumberPad() {
        const numberPad = document.getElementById('numberPad');
        numberPad.innerHTML = '';
        
        const maxNum = this.boardSize;
        
        for (let i = 1; i <= maxNum; i++) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.textContent = i;
            btn.addEventListener('click', () => this.enterNumber(i));
            numberPad.appendChild(btn);
        }
        
        // Add erase button
        const eraseBtn = document.createElement('button');
        eraseBtn.className = 'number-btn erase';
        eraseBtn.textContent = '×';
        eraseBtn.addEventListener('click', () => this.enterNumber(0));
        numberPad.appendChild(eraseBtn);
    }

    // ========================================
    // User Interaction
    // ========================================

    selectCell(cell, row, col) {
        if (cell.classList.contains('fixed')) {
            return;
        }
        
        // Remove previous selection
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected', 'highlight'));
        
        // Always show selected cell border
        cell.classList.add('selected');
        this.selectedCell = { row, col, element: cell };
        
        // Highlight same row and column (only when highlight enabled)
        if (this.highlightEnabled) {
            this.highlightRelatedCells(row, col);
        }
    }

    highlightRelatedCells(row, col) {
        document.querySelectorAll('.cell').forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            
            if ((r === row || c === col) && !(r === row && c === col)) {
                cell.classList.add('highlight');
            }
        });
    }

    enterNumber(num) {
        if (!this.selectedCell) return;
        
        const { row, col, element } = this.selectedCell;
        
        // Validate number range
        if (num > this.boardSize) return;
        
        // 记录操作历史（保存修改前的值）
        const prevValue = this.board[row][col];
        if (prevValue !== num) {
            this.history.push({ row, col, prevValue });
        }
        
        // Update board
        this.board[row][col] = num;
        
        // Update display
        element.textContent = num || '';
        element.classList.remove('error', 'correct');
        
        if (num !== 0) {
            element.classList.add('user-input');
        } else {
            element.classList.remove('user-input');
        }
        
        // Check for conflicts (only when highlight is enabled)
        if (this.highlightEnabled && num !== 0 && !this.isValidMove(row, col, num)) {
            element.classList.add('error');
        }
    }

    undo() {
        if (this.history.length === 0) return;
        
        const { row, col, prevValue } = this.history.pop();
        
        // 恢复数据
        this.board[row][col] = prevValue;
        
        // 恢复显示
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = prevValue || '';
            cell.classList.remove('error', 'correct');
            
            if (prevValue !== 0) {
                cell.classList.add('user-input');
            } else {
                cell.classList.remove('user-input');
            }
            
            // 重新检查冲突
            if (this.highlightEnabled && prevValue !== 0 && !this.isValidMove(row, col, prevValue)) {
                cell.classList.add('error');
            }
        }
    }

    handleKeyPress(e) {
        // Ctrl+Z / Cmd+Z 撤销
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            this.undo();
            return;
        }
        
        if (!this.selectedCell) return;
        
        const maxNum = this.boardSize;
        const num = parseInt(e.key);
        
        if (num >= 1 && num <= maxNum) {
            this.enterNumber(num);
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            this.enterNumber(0);
        } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            this.navigateCell(e.key);
            e.preventDefault();
        }
    }

    navigateCell(direction) {
        if (!this.selectedCell) return;
        
        let { row, col } = this.selectedCell;
        const size = this.boardSize;
        
        switch (direction) {
            case 'ArrowUp': row = Math.max(0, row - 1); break;
            case 'ArrowDown': row = Math.min(size - 1, row + 1); break;
            case 'ArrowLeft': col = Math.max(0, col - 1); break;
            case 'ArrowRight': col = Math.min(size - 1, col + 1); break;
        }
        
        const cells = document.querySelectorAll('.cell');
        const newCell = cells[row * size + col];
        
        if (newCell && !newCell.classList.contains('fixed')) {
            this.selectCell(newCell, row, col);
        }
    }

    // ========================================
    // Validation
    // ========================================

    isValidMove(row, col, num) {
        return this.validateCell(row, col, num, this.board);
    }

    validateCell(row, col, num, board) {
        const size = this.boardSize;
        
        // Check row
        for (let j = 0; j < size; j++) {
            if (j !== col && board[row][j] === num) return false;
        }
        
        // Check column
        for (let i = 0; i < size; i++) {
            if (i !== row && board[i][col] === num) return false;
        }
        
        // Check box (for standard sudoku types)
        const config = this.typeConfigs[this.currentType];
        if (config.boxRows && config.boxCols) {
            const boxStartRow = Math.floor(row / config.boxRows) * config.boxRows;
            const boxStartCol = Math.floor(col / config.boxCols) * config.boxCols;
            
            for (let i = boxStartRow; i < boxStartRow + config.boxRows; i++) {
                for (let j = boxStartCol; j < boxStartCol + config.boxCols; j++) {
                    if ((i !== row || j !== col) && board[i][j] === num) return false;
                }
            }
        }
        
        // Check irregular regions
        if (this.currentType === 'irregular7') {
            if (!this.validateIrregular(row, col, num, board)) return false;
        }
        
        return true;
    }

    validateIrregular(row, col, num, board) {
        if (!this.puzzleData.regions) return true;
        
        const regions = this.puzzleData.regions;
        const region = regions[row][col];
        const size = this.boardSize;
        
        // Check region
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (regions[i][j] === region && (i !== row || j !== col)) {
                    if (board[i][j] === num) return false;
                }
            }
        }
        
        return true;
    }

    checkSolution() {
        let isComplete = true;
        let hasErrors = false;
        
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            if (isNaN(row) || isNaN(col)) return;
            
            const value = this.board[row][col];
            
            cell.classList.remove('error', 'correct');
            
            if (value === 0 || value === undefined || value < 0) {
                isComplete = false;
            } else {
                const expected = this.solution[row]?.[col];
                if (expected !== undefined && expected > 0 && expected !== value) {
                    if (this.highlightEnabled) {
                        cell.classList.add('error');
                    }
                    hasErrors = true;
                } else if (expected === value && !cell.classList.contains('fixed')) {
                    if (this.highlightEnabled) {
                        cell.classList.add('correct');
                    }
                }
            }
        });
        
        if (!isComplete) {
            this.showMessage('⚠️ 还没有完成哦，继续加油！');
        } else if (hasErrors) {
            this.showMessage('❌ 有错误，请检查红色标记的格子');
        } else {
            this.stopTimer();
            const timeStr = this.formatTime(this.elapsedSeconds);
            this.showMessage(`🎉 恭喜你！数独完成正确！用时：${timeStr}`);
            document.querySelector('.game-container').classList.add('success-animation');
            setTimeout(() => {
                document.querySelector('.game-container').classList.remove('success-animation');
            }, 500);
        }
    }

    clearUserInput() {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            if (!cell.classList.contains('fixed')) {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                
                if (!isNaN(row) && !isNaN(col)) {
                    this.board[row][col] = 0;
                    cell.textContent = '';
                    cell.classList.remove('error', 'correct', 'selected', 'highlight', 'user-input');
                }
            }
        });
        
        this.selectedCell = null;
        this.history = [];
    }

    giveHint() {
        const size = this.boardSize;
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const boardValue = this.board[i][j];
                const solutionValue = this.solution[i]?.[j];
                
                if (boardValue === 0 && solutionValue > 0) {
                    this.board[i][j] = solutionValue;
                    
                    const cells = document.querySelectorAll('.cell');
                    const cellIndex = i * size + j;
                    const cell = cells[cellIndex];
                    
                    if (cell && !cell.classList.contains('fixed')) {
                        cell.textContent = solutionValue;
                        cell.classList.add('user-input');
                        if (this.highlightEnabled) {
                            cell.classList.add('correct');
                        }
                        cell.style.animation = 'popIn 0.3s ease';
                        setTimeout(() => {
                            cell.style.animation = '';
                        }, 300);
                    }
                    
                    return;
                }
            }
        }
        
        this.showMessage('💡 已经没有可以提示的格子了！');
    }

    showMessage(text) {
        document.getElementById('messageText').textContent = text;
        document.getElementById('messageBox').classList.remove('hidden');
    }

    hideMessage() {
        document.getElementById('messageBox').classList.add('hidden');
    }

    toggleHighlight() {
        this.highlightEnabled = !this.highlightEnabled;
        const btn = document.getElementById('highlightToggle');
        
        if (btn) {
            if (this.highlightEnabled) {
                btn.textContent = '🌈 高亮提示：开';
                btn.classList.remove('off');
                btn.classList.add('on');
            } else {
                btn.textContent = '🌈 高亮提示：关';
                btn.classList.remove('on');
                btn.classList.add('off');
            }
        }
        
        // 切换整个棋盘的状态class
        const boardEl = document.getElementById('sudokuBoard');
        boardEl.classList.toggle('no-highlight', !this.highlightEnabled);
        
        // 清除所有现有高亮和错误/正确状态
        document.querySelectorAll('.cell').forEach(c => {
            c.classList.remove('selected', 'highlight', 'error', 'correct');
        });
        
        // 如果开启高亮且有选中格子，重新应用高亮
        if (this.highlightEnabled && this.selectedCell) {
            const { row, col, element } = this.selectedCell;
            element.classList.add('selected');
            this.highlightRelatedCells(row, col);
            
            // 重新检查冲突
            const value = this.board[row][col];
            if (value !== 0 && !this.isValidMove(row, col, value)) {
                element.classList.add('error');
            }
        }
        
        this.selectedCell = null;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
