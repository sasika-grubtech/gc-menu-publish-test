#!/bin/bash
input_file="cypress/results/gc3_publish-exection.xml"  # Replace with your XML file path
node_name="testsuite"      # Replace with the node name you want to remove
attribute_name="name"             # Replace with the attribute name
attribute_value="Smoke-test-suite"           # Replace with the attribute value
echo "Searching for: <$node_name $attribute_name=\"$attribute_value\"> in $input_file"
line_number=$(grep -n "<$node_name " "$input_file" | grep "$attribute_name=\"$attribute_value\"" | cut -d: -f1)
if [ -n "$line_number" ]; then
    start_line=$((line_number))
    end_line=$(awk "/<$node_name $attribute_name=\"$attribute_value\">/,/<\/$node_name>/" "$input_file" | grep -n "<\/$node_name>" | tail -1 | cut -d: -f1)
    end_line=$((start_line + end_line - 1))
    sed -i "${start_line},${end_line}d" "$input_file"
    echo "Node with $attribute_name='$attribute_value' removed from $input_file"
else
    echo "Node with $attribute_name='$attribute_value' not found in $input_file"
fi