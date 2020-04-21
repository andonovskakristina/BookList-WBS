import React, {useEffect, useState} from "react";
import Select from "react-dropdown-select";
import css from "../css/multiSelect.css"

const MultiSelect = (props) => {
    const genres = props.genreOptions;

    const options = genres.map((name) => ({
        label: name,
        value: name
    }));

    const [selected, setSelected] = useState(props.selectedGenres);

    useEffect(() => {
        setSelected(props.selectedGenres);
    }, [props.selectedGenres]);

    return (
        <div style={{textAlign: "left !important", fontSize: "1rem !important"}} className={"my-2"}>
            <Select
                options={options}
                value={selected}
                labelledBy={"Select"}
                onChange={e => { setSelected(e); props.onGenreChange(e)}}
                searchable={true}
                placeholder={"Genres"}
                multi={true}
                className={"form-control"}
                values={props.selectedGenres ? props.selectedGenres : []}
            />
        </div>
    );
};

export default MultiSelect;