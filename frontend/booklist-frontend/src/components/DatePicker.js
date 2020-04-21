import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class DatePickerr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date()
        };
    }

    componentDidMount() {
        this.setState({
            startDate: this.props.selectedDate ? new Date(this.props.selectedDate) : this.state.startDate
        });
    }

    handleChange = date => {
        this.setState({
            startDate: date
        });
        this.props.onDateChange(this.formatDate(date));
    };

    formatDate = date => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    };

    render() {
        return (
            <DatePicker
                selected={this.props.selectedDate ? new Date(this.props.selectedDate) : this.state.startDate}
                onChange={this.handleChange}
                className={"form-control"}
                dateFormat={"yyy-MM-dd"}
            />
        );
    }
}

export default DatePickerr