function Books(props) {
return(
        <tr>
            <td> {props.name} </td>
            <td> {props.author} </td>
            <td> {props.price} </td>
        </tr>
)
}
export default Books;
