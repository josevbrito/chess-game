#!/bin/bash

# Path to the JavaFX library
JAVAFX_PATH="/usr/share/openjfx/lib"
SRC_PATH="src"
OUT_PATH="out"

# Create the output directory if it doesn't exist
mkdir -p $OUT_PATH

# Compile the code
javac --module-path $JAVAFX_PATH --add-modules javafx.controls -d $OUT_PATH $SRC_PATH/chessgame/*.java

# Run the program
java --module-path $JAVAFX_PATH --add-modules javafx.controls -cp $OUT_PATH chessgame.ChessMenu
