# Chess Game

This is a basic two-player chess game built using only **HTML, CSS, and JavaScript**.
The goal is to provide a functional foundation for a chess game with **move validation** and **check detection**, making it perfect for those learning web development or looking for a fun project to add to their portfolio.

---

## Features

* **Interactive Board:** Clean visual interface with alternating square colors and Unicode chess pieces.
* **Selection Highlighting:** Clicking a piece highlights the square in green.
* **Valid Moves:** Squares where the selected piece can legally move are highlighted in light blue. If the move results in a capture, the target square is highlighted in red.
* **Rule Validation:**

  * **Pawns:** Move one or two squares forward on the first move and capture diagonally.
  * **Rooks, Bishops, Queens:** Move in straight or diagonal lines without jumping over pieces.
  * **Knights:** Move in an “L” shape.
  * **Kings:** Move one square in any direction.
  * **Captures:** Opponent pieces can be captured.
  * **Check:** The game detects when a king is in check, shows a warning message, and highlights the king. Moves that would leave the king in check are **blocked**.
* **Pawn Promotion:** Automatically promotes a pawn to a queen upon reaching the last rank.
* **Turn Alternation:** The turn automatically switches to the other player after each valid move.
* **Restart Game:** A button allows players to reset the board to the initial position at any time.

---

## How to Use

To run this game locally, follow these simple steps:

1. **Clone or Download the Repository:** Get the project files to your machine.
2. **File Structure:** Make sure `index.html` and `script.js` are in the **same folder**.
3. **Open in Browser:** Just open `index.html` in any modern web browser.

---

## Project Structure

* `index.html`: Contains the HTML structure and all CSS styling.
* `script.js`: Contains the entire JavaScript logic, including board rendering, event handling, move validation, and check detection.

---

## Next Steps (Possible Improvements)

This game is a great starting point. If you'd like to expand it, consider adding the following features:

* **Checkmate & Stalemate Detection:** Implement logic to determine game-ending scenarios.
* **Castling:** Add the special king and rook move.
* ***En Passant*:** Implement the special pawn capture rule.
* **Pawn Promotion Interface:** Let players choose between Queen, Rook, Bishop, or Knight for promotion.
* **Move History:** Keep and display a list of all moves played.
* **Sound Effects:** Add sounds for moves, captures, and check alerts.
* **Responsive Design:** Optimize the layout for different screen sizes.

---

Feel free to explore the code, make modifications, and add new features!
Contributions are always welcome! ♟️
