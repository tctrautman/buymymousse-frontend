import UpdateItem from '../components/UpdateItem';

const UpdatePage = props => (
    <div>
        <UpdateItem id={props.query.id} />
    </div>
);

export default UpdatePage;
