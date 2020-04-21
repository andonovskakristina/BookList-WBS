import React from 'react'
import ReactD3, {BarChart, LineChart, ScatterPlot} from 'react-d3-components'

const MyBarChart = (props) => {
    var genres = props.genres;
    var books = props.books;
    var numberBooks = [];
    var list = [];

    for (var i = 0; i < genres.length; i++) {
        numberBooks[i] = 0;
    }

    if(books) {
        for (var i = 0; i < books.length; i++) {
            var bookGenres = books[i].bookGenres.split(", ");
            for (var j = 0; j < bookGenres.length; j++) {
                var index = genres.indexOf(bookGenres[j]);
                if(index !== -1)
                    numberBooks[index]++;
            }
        }
    }

    for(var i = 0; i < genres.length; i++) {
        list.push({x: genres[i], y: numberBooks[i]});
    }

    let data = [
        {
            label: "somethingA",
            values: list.length > 0 ? list : [{x: [], y: []}]
        }
    ];

    var tooltip = function(x, y0, y, total) {
        return x + " " + y.toString();
    };

    const scale = value => {
        // some color selection
        return 'gray';
    };

    return (
        <div style={{textAlign: "left !important", fontSize: "1rem !important"}} className={"my-2"}>
            <BarChart
                data={data}
                width={1200}
                height={500}
                margin={{top: 10, bottom: 50, left: 50, right: 10}}
                yAxis={{label: "Number of Books by Genre"}}
                xAxis={{label: "Genres"}}
                tooltipHtml={tooltip}
                tooltipMode={'element'}
                colorByLabel={true}
                colorScale={scale}
            />
        </div>
    );
};

export default MyBarChart;