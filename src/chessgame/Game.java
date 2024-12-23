package chessgame;

public class Game {

    public void startGame() {
        System.out.println("=== Welcome to Chess ===");
        System.out.println("Initializing the chess game...");
        initializeBoard();
    }

    private void initializeBoard() {
        System.out.println("\nSetting up the chess board...\n");

        // Create an 8x8 chess board represented as a 2D array
        String[][] board = new String[8][8];

        // Populate the board with initial empty placeholders
        for (int i = 0; i < 8; i++) {
            for (int j = 0; j < 8; j++) {
                board[i][j] = ".";
            }
        }

        // Display the board in the console
        printBoard(board);
    }

    private void printBoard(String[][] board) {
        System.out.println("   a b c d e f g h");
        System.out.println("  +----------------+");

        for (int i = 0; i < board.length; i++) {
            System.out.print((8 - i) + " | "); // Row numbers
            for (int j = 0; j < board[i].length; j++) {
                System.out.print(board[i][j] + " ");
            }
            System.out.println("| " + (8 - i)); // Row numbers on the right
        }

        System.out.println("  +----------------+");
        System.out.println("   a b c d e f g h");
    }

    public static void main(String[] args) {
        Game game = new Game();
        game.startGame();
    }
}
