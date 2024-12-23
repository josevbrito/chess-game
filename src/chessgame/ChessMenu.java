package chessgame;

import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.scene.text.Text;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;

public class ChessMenu extends Application {

    @Override
    public void start(Stage primaryStage) {
        // Title text
        Text titleText = new Text("Chess Game");
        titleText.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        titleText.setStyle("-fx-fill: #2c3e50; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.75), 4, 0.5, 0.0, 1.5);");

        // Buttons
        Button startButton = new Button("Start");
        Button rulesButton = new Button("Rules");

        // Styling buttons
        styleButton(startButton);
        styleButton(rulesButton);

        // Layout for buttons
        VBox buttonBox = new VBox(20, startButton, rulesButton);
        buttonBox.setAlignment(Pos.CENTER);

        // Footer text
        Text footerText = new Text("Created by José Brito (josevbrito)");
        footerText.setFont(Font.font("Arial", 12));
        footerText.setStyle("-fx-opacity: 0.7;");

        // Main layout
        BorderPane mainLayout = new BorderPane();
        mainLayout.setTop(titleText);
        mainLayout.setCenter(buttonBox);
        mainLayout.setBottom(footerText);

        BorderPane.setAlignment(titleText, Pos.CENTER);
        BorderPane.setAlignment(footerText, Pos.CENTER);

        // Scene configuration
        Scene scene = new Scene(mainLayout, 400, 300);
        scene.getStylesheets().add(getClass().getResource("/styles.css").toExternalForm());
        primaryStage.setTitle("Chess Game Menu");
        primaryStage.setScene(scene);
        primaryStage.show();

        // Button actions
        startButton.setOnAction(event -> startGame());
        rulesButton.setOnAction(event -> showRules());
    }

    private void styleButton(Button button) {
        button.setPrefWidth(200);
        button.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        button.setStyle(
                "-fx-background-color: #3498db; -fx-text-fill: white; " +
                        "-fx-background-radius: 5; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.5), 4, 0.5, 0.0, 1.5);"
        );

        // Hover effect
        button.setOnMouseEntered(e -> button.setStyle(
                "-fx-background-color: #2980b9; -fx-text-fill: white; " +
                        "-fx-background-radius: 5; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.75), 4, 0.5, 0.0, 1.5);"
        ));
        button.setOnMouseExited(e -> button.setStyle(
                "-fx-background-color: #3498db; -fx-text-fill: white; " +
                        "-fx-background-radius: 5; -fx-effect: dropshadow(gaussian, rgba(0,0,0,0.5), 4, 0.5, 0.0, 1.5);"
        ));
    }

    // Start game method
    private void startGame() {
        System.out.println("Game started!");
        Game game = new Game();
        game.startGame();
    }

    // Show rules method
    private void showRules() {
        System.out.println("Displaying rules!");
        // Extend this method to display rules in a new window
    }

    public static void main(String[] args) {
        launch(args);
    }
}
