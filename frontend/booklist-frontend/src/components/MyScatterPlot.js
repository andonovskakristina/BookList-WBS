import React, {useEffect, useState} from 'react'
import ReactD3, {LineChart, ScatterPlot} from 'react-d3-components'

const MyScatterPlot = (props) => {
    var pages = props.numberPages;
    var reviews = props.reviews;
    var list = [];
    var maxReview = Math.max.apply(Math, reviews);
    var maxPages = Math.max.apply(Math, pages);

    for(var i = 0; i < pages.length; i++) {
        list.push({x: pages[i], y: reviews[i]});
    }

    var tooltipScatter = function(x, y) {
        return "x: " + x + " y: " + y;
    };

    var tooltipLine = function(x, y) {
        return "x: " + x + " y: " + y;
    };

    let data = [
        {
            label: "somethingA",
            values: list.length > 0 ? list : [{x: [], y: []}]
        }
    ];

    return (
        <div style={{textAlign: "left !important", fontSize: "1rem !important"}} className={"my-2"}>
            <ScatterPlot
                data={data}
                width={500}
                height={500}
                margin={{top: 10, bottom: 50, left: 50, right: 10}}
                tooltipHtml={tooltipScatter}
                xAxis={{label: "Number of pages"}}
                yAxis={{label: "Review"}}/>
        </div>
    );
};

export default MyScatterPlot;