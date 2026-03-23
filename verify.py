"""Verify all sudoku puzzle data integrity"""

# Six standard
s6_puzzle = [
    [0, 0, 0, 5, 0, 2],
    [0, 5, 0, 0, 4, 0],
    [0, 0, 0, 6, 0, 5],
    [5, 0, 1, 0, 0, 0],
    [0, 4, 0, 0, 2, 0],
    [3, 0, 6, 0, 0, 0]
]
s6_sol = [
    [4, 1, 3, 5, 6, 2],
    [6, 5, 2, 1, 4, 3],
    [2, 3, 4, 6, 1, 5],
    [5, 6, 1, 2, 3, 4],
    [1, 4, 5, 3, 2, 6],
    [3, 2, 6, 4, 5, 1]
]

# Diagonal 6
d6_puzzle = [
    [0, 0, 5, 0, 2, 0],
    [1, 0, 4, 0, 0, 0],
    [0, 0, 0, 0, 5, 0],
    [0, 3, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 6],
    [0, 1, 0, 2, 0, 0]
]
d6_sol = [
    [3, 6, 5, 4, 2, 1],
    [1, 2, 4, 5, 6, 3],
    [6, 4, 1, 3, 5, 2],
    [5, 3, 2, 6, 1, 4],
    [2, 5, 3, 1, 4, 6],
    [4, 1, 6, 2, 3, 5]
]

# Anti-knight 6
ak_puzzle = [
    [0, 3, 0, 0, 6, 0],
    [5, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 2],
    [0, 4, 0, 0, 5, 0]
]
ak_sol = [
    [1, 3, 4, 2, 6, 5],
    [5, 6, 2, 1, 3, 4],
    [4, 2, 6, 5, 1, 3],
    [3, 1, 5, 4, 2, 6],
    [6, 5, 1, 3, 4, 2],
    [2, 4, 3, 6, 5, 1]
]

# Killer 6
k6_sol = [
    [5, 4, 3, 1, 6, 2],
    [1, 6, 2, 3, 4, 5],
    [2, 1, 6, 4, 5, 3],
    [4, 3, 5, 2, 1, 6],
    [6, 2, 1, 5, 3, 4],
    [3, 5, 4, 6, 2, 1]
]

# Irregular 7
i7_puzzle = [
    [6, 4, 0, 5, 3, 0, 0],
    [0, 0, 7, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 2, 6, 1, 0, 7, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 4, 6, 0, 0],
    [0, 0, 0, 0, 0, 6, 0]
]
i7_sol = [
    [6, 4, 1, 5, 3, 2, 7],
    [4, 5, 7, 2, 1, 3, 6],
    [5, 3, 2, 6, 7, 1, 4],
    [3, 2, 6, 1, 4, 7, 5],
    [7, 6, 5, 3, 2, 4, 1],
    [1, 7, 3, 4, 6, 5, 2],
    [2, 1, 4, 7, 5, 6, 3]
]
i7_regions = [
    [0, 0, 0, 0, 0, 0, 1],
    [2, 2, 0, 1, 1, 1, 1],
    [3, 2, 2, 2, 2, 2, 1],
    [3, 3, 3, 3, 3, 3, 1],
    [4, 4, 4, 4, 4, 4, 5],
    [4, 6, 6, 6, 6, 6, 5],
    [6, 6, 5, 5, 5, 5, 5]
]

# Skyscraper 6
sk_puzzle = [
    [0, 0, 0, 2, 0, 0],
    [0, 4, 0, 0, 5, 0],
    [0, 0, 0, 0, 0, 5],
    [4, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 3, 0],
    [0, 0, 2, 0, 0, 0]
]
sk_sol = [
    [5, 3, 6, 2, 1, 4],
    [2, 4, 1, 6, 5, 3],
    [1, 6, 3, 4, 2, 5],
    [4, 2, 5, 3, 6, 1],
    [6, 1, 4, 5, 3, 2],
    [3, 5, 2, 1, 4, 6]
]

def verify_standard(puzzle, solution, size, box_rows, box_cols, name):
    errors = []
    # Check puzzle matches solution
    for i in range(size):
        for j in range(size):
            if puzzle[i][j] != 0 and puzzle[i][j] != solution[i][j]:
                errors.append(f"Puzzle ({i},{j})={puzzle[i][j]} != solution={solution[i][j]}")
    
    # Check rows
    for i in range(size):
        vals = solution[i]
        if sorted(vals) != list(range(1, size+1)):
            errors.append(f"Row {i} invalid: {vals}")
    
    # Check cols
    for j in range(size):
        vals = [solution[i][j] for i in range(size)]
        if sorted(vals) != list(range(1, size+1)):
            errors.append(f"Col {j} invalid: {vals}")
    
    # Check boxes
    if box_rows and box_cols:
        for br in range(0, size, box_rows):
            for bc in range(0, size, box_cols):
                vals = []
                for i in range(br, br+box_rows):
                    for j in range(bc, bc+box_cols):
                        vals.append(solution[i][j])
                if sorted(vals) != list(range(1, size+1)):
                    errors.append(f"Box ({br},{bc}) invalid: {vals}")
    
    if errors:
        print(f"❌ {name}: {len(errors)} errors")
        for e in errors[:5]:
            print(f"   {e}")
    else:
        print(f"✅ {name}: OK")

def verify_diagonal(puzzle, solution, size, name):
    verify_standard(puzzle, solution, size, 2, 3, name)
    # Check diagonals
    main_diag = [solution[i][i] for i in range(size)]
    anti_diag = [solution[i][size-1-i] for i in range(size)]
    if sorted(main_diag) != list(range(1, size+1)):
        print(f"   Main diagonal invalid: {main_diag}")
    if sorted(anti_diag) != list(range(1, size+1)):
        print(f"   Anti-diagonal invalid: {anti_diag}")

def verify_irregular(puzzle, solution, regions, size, name):
    errors = []
    for i in range(size):
        for j in range(size):
            if puzzle[i][j] != 0 and puzzle[i][j] != solution[i][j]:
                errors.append(f"Puzzle ({i},{j})={puzzle[i][j]} != solution={solution[i][j]}")
    for i in range(size):
        if sorted(solution[i]) != list(range(1, size+1)):
            errors.append(f"Row {i} invalid")
    for j in range(size):
        vals = [solution[i][j] for i in range(size)]
        if sorted(vals) != list(range(1, size+1)):
            errors.append(f"Col {j} invalid")
    from collections import defaultdict
    region_vals = defaultdict(list)
    for i in range(size):
        for j in range(size):
            region_vals[regions[i][j]].append(solution[i][j])
    for r, vals in region_vals.items():
        if sorted(vals) != list(range(1, size+1)):
            errors.append(f"Region {r} invalid: {sorted(vals)}")
    if errors:
        print(f"❌ {name}: {len(errors)} errors")
        for e in errors[:5]:
            print(f"   {e}")
    else:
        print(f"✅ {name}: OK")

def verify_skyscraper(puzzle, solution, clues, size, name):
    verify_standard(puzzle, solution, size, 2, 3, name)
    top, bottom, left, right = clues['top'], clues['bottom'], clues['left'], clues['right']
    
    def count_visible(buildings):
        count = 0
        max_h = 0
        for b in buildings:
            if b > max_h:
                count += 1
                max_h = b
        return count
    
    for j in range(size):
        col = [solution[i][j] for i in range(size)]
        if count_visible(col) != top[j]:
            print(f"   Top clue col {j}: expected {top[j]}, got {count_visible(col)}")
        if count_visible(col[::-1]) != bottom[j]:
            print(f"   Bottom clue col {j}: expected {bottom[j]}, got {count_visible(col[::-1])}")
    
    for i in range(size):
        row = solution[i]
        if count_visible(row) != left[i]:
            print(f"   Left clue row {i}: expected {left[i]}, got {count_visible(row)}")
        if count_visible(row[::-1]) != right[i]:
            print(f"   Right clue row {i}: expected {right[i]}, got {count_visible(row[::-1])}")

print("=== Verifying all sudoku data ===\n")
verify_standard(s6_puzzle, s6_sol, 6, 2, 3, "Six Standard")
verify_diagonal(d6_puzzle, d6_sol, 6, "Six Diagonal")
verify_standard(ak_puzzle, ak_sol, 6, 2, 3, "Six Anti-knight")
verify_standard([[0]*6 for _ in range(6)], k6_sol, 6, 2, 3, "Six Killer (solution only)")
verify_irregular(i7_puzzle, i7_sol, i7_regions, 7, "Seven Irregular")
verify_skyscraper(sk_puzzle, sk_sol, 
    {'top': [2,3,1,2,3,3], 'bottom': [2,2,4,3,2,1], 'left': [2,3,2,3,1,3], 'right': [2,3,2,2,4,1]},
    6, "Six Skyscraper")

# Verify anti-knight constraint
print("\nVerifying anti-knight constraint:")
knight_moves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]
errors = 0
for i in range(6):
    for j in range(6):
        for dr, dc in knight_moves:
            ni, nj = i+dr, j+dc
            if 0 <= ni < 6 and 0 <= nj < 6:
                if ak_sol[i][j] == ak_sol[ni][nj]:
                    errors += 1
if errors == 0:
    print("✅ Anti-knight: OK")
else:
    print(f"❌ Anti-knight: {errors} violations")

# Verify killer cages
print("\nVerifying killer cages:")
cages = [
    {'cells': [[0,0],[1,0]], 'sum': 6},
    {'cells': [[0,1],[0,2]], 'sum': 7},
    {'cells': [[0,3],[1,3]], 'sum': 4},
    {'cells': [[0,4],[0,5]], 'sum': 8},
    {'cells': [[1,1],[1,2]], 'sum': 8},
    {'cells': [[1,4],[1,5]], 'sum': 9},
    {'cells': [[2,0],[3,0]], 'sum': 6},
    {'cells': [[2,1],[2,2]], 'sum': 7},
    {'cells': [[2,3],[2,4]], 'sum': 9},
    {'cells': [[2,5],[3,5]], 'sum': 9},
    {'cells': [[3,1],[3,2]], 'sum': 8},
    {'cells': [[3,3],[3,4]], 'sum': 3},
    {'cells': [[4,0],[5,0]], 'sum': 9},
    {'cells': [[4,1],[4,2]], 'sum': 3},
    {'cells': [[4,3],[4,4],[4,5]], 'sum': 12},
    {'cells': [[5,1],[5,2]], 'sum': 9},
    {'cells': [[5,3],[5,4],[5,5]], 'sum': 9},
]
all_cells = set()
cage_errors = 0
for cage in cages:
    actual_sum = sum(k6_sol[r][c] for r, c in cage['cells'])
    for r, c in cage['cells']:
        all_cells.add((r, c))
    if actual_sum != cage['sum']:
        print(f"  Cage {cage['cells']}: expected {cage['sum']}, got {actual_sum}")
        cage_errors += 1
    # Check no duplicates in cage
    vals = [k6_sol[r][c] for r, c in cage['cells']]
    if len(vals) != len(set(vals)):
        print(f"  Cage {cage['cells']}: has duplicates {vals}")
        cage_errors += 1

if len(all_cells) == 36:
    print(f"  All 36 cells covered ✅")
else:
    print(f"  Only {len(all_cells)} cells covered ❌")

if cage_errors == 0:
    print("✅ Killer cages: OK")
else:
    print(f"❌ Killer cages: {cage_errors} errors")
