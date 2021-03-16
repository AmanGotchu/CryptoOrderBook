import '../App.css';

/* eslint-disable react/prop-types */
function TradeHistoryRow(props) {
    return(
        <div className="newRow" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", width: "100%", minHeight: 60, backgroundColor: props.colorValue ? "white" : "#F2F2F3"}}>
            <p style={styles.cellStyle}>
                {props.tradeSize}
            </p>

            <p style={styles.cellStyle}>
                {props.tradePrice}
            </p>

            <p style={styles.cellStyle}>
                {props.tradeTime}
            </p>
        </div>
    );
}

const styles = {
    cellStyle: {
        display: "flex", 
        flexWrap: "wrap", 
        width: "33%", 
        justifyContent: "center",
        alignItems: "center"
    }
}

export default TradeHistoryRow;