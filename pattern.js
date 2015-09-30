function show_pattern() {



    var top_position = 125,
        left_position = 350,
        width = 300,
        height = 300;
    var color_list = ["OrangeRed", "DeepPink", "Gold", "LawnGreen", "SpringGreen", "SteelBlue", "OliveDrab", "Red", "Magenta", "Wheat"];

    while (width > 50) {
        var this_div = document.createElement("div");
        var random_color = Math.floor(Math.random() * 10);

        this_div.style.top = top_position + "px";
        this_div.style.left = left_position + "px";
        this_div.style.width = width + "px";
        this_div.style.height = height + "px";
        this_div.style.background = color_list[random_color];

        var the_body = document.getElementById("theBody");
        the_body.appendChild(this_div);

        top_position += 10;
        left_position += 10;
        width -= 20;
        height -= 20;


    }

}