import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setimageUploadProgress] = useState(null);
    const [imageUploadError, setimageUploadError] = useState(null);
    const [formData, setFormData] = useState({ subEvents: [] });
    const [publishError, setPublishError] = useState(null);
    const [subEventName, setSubEventName] = useState('');
    const [subEventPrice, setSubEventPrice] = useState('');
    const [subEventError, setSubEventError] = useState(null);

    const navigate = useNavigate();

    const handleAddSubEvent = () => {
        if (!subEventName || !subEventPrice) {
            setSubEventError('Please provide both name and price for the sub-event.');
            return;
        }
        setSubEventError(null);

        const newSubEvent = { eventName: subEventName, eventPrice: parseFloat(subEventPrice) };
        setFormData((prev) => ({
            ...prev,
            subEvents: [...prev.subEvents, newSubEvent]
        }));
        setSubEventName('');
        setSubEventPrice('');
    };

    const handleUploadImage = async() => {
        if (!file) {
            setimageUploadError('Please select an image');
            return;
        }
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setimageUploadProgress(progress.toFixed(0));
        }, 
        () => {
            setimageUploadError('Image upload failed');
            setimageUploadProgress(null);
        }, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setimageUploadProgress(null);
                setimageUploadError(null);
                setFormData({ ...formData, image: downloadURL });
            });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }
            setPublishError(null);
            navigate(`/post/${data.slug}`);
        } catch (error) {
            setPublishError('Something went wrong!');
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Select
                        size="lg"
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="uncategorized">Select a category</option>
                        <option value="hackathon">hackathon</option>
                        <option value="CSE_dept">CSE_dept</option>
                        <option value="ECE_dept">ECE_dept</option>
                        <option value="Civil_dept">Civil_dept</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput 
                        type='file' 
                        accept='image/*' 
                        size="lg" 
                        onChange={(e) => setFile(e.target.files[0]) }
                    />
                    <Button 
                        type='button' 
                        gradientDuoTone="purpleToBlue" 
                        size="lg" 
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                    {imageUploadProgress ?
                        <div className='w-16 h-16'>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                        </div>
                        : 'Upload Image'}
                    </Button>
                </div>
                {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                {formData.image && (
                    <img src={formData.image} alt='upload' className='w-full h-72 aspect-auto object-center rounded-lg shadow-md'/>
                )}

                <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12'
                    required
                    onChange={(value) => setFormData({ ...formData, content: value })}
                />

                <div className='flex gap-4'>
                    <TextInput
                        type='text'
                        placeholder='Sub-event name'
                        value={subEventName}
                        onChange={(e) => setSubEventName(e.target.value)}
                    />
                    <TextInput
                        type='number'
                        placeholder='Sub-event price'
                        value={subEventPrice}
                        onChange={(e) => setSubEventPrice(e.target.value)}
                    />
                    <Button type='button' onClick={handleAddSubEvent}>Add Sub-Event</Button>
                </div>
                {subEventError && <Alert color='failure'>{subEventError}</Alert>}

                {formData.subEvents.length > 0 && (
                    <ul className='mt-4'>
                        {formData.subEvents.map((subEvent, index) => (
                            <li key={index} className='flex justify-between p-2 border rounded'>
                                <span>{subEvent.eventName}</span>
                                <span>${subEvent.eventPrice}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <Button type='submit' gradientDuoTone="purpleToPink">Publish</Button>
                {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
            </form>
        </div>
    );
};

export default CreatePost;
