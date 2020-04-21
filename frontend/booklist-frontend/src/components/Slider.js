import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: "80%"
    },
});

function valuetext(value) {
    return `${value}`;
}

export default function RangeSlider(props) {
    const minVal = parseInt(props.minPages);
    const maxVal = parseInt(props.maxPages);

    const classes = useStyles();
    const [value, setValue] = React.useState([props.minPages, props.maxPages]);

    React.useEffect(() => {
        setValue([props.minPages, props.maxPages]);
    }, [props.minPages, props.maxPages]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        props.filterByPage(newValue[0], newValue[1]);
        document.getElementById("showMinMax").innerText = newValue[0] + " pages - " + newValue[1] + " pages";
    };

    return (
        <div className={classes.root}>
            <h6>Number of Pages Filter</h6>
            <Slider
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
                min={minVal}
                max={maxVal}
                style={{color: "black"}}
            />
            <span id={"showMinMax"}>{props.minPages} pages - {props.maxPages} pages</span>
        </div>
    );
}