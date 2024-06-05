import api, { Bom, Image, Robot } from "hooks/api";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

const RobotForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [robot_name, setName] = useState<string>("");
  const [robot_description, setDescription] = useState<string>("");
  const [robot_bom, setBom] = useState<Bom[]>([]);
  const [robot_images, setImages] = useState<Image[]>([]);

  const handleImageChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const newImages = [...robot_images];
    newImages[index][name as keyof Image] = value;
    setImages(newImages);
  };

  const handleAddImage = () => {
    setImages([...robot_images, { url: "", caption: "" }]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = robot_images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleBomChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const newBom = [...robot_bom];
    if (name === "quantity" || name === "price") {
      newBom[index][name as "quantity" | "price"] = Number(value);
    } else {
      newBom[index][name as "name"] = value;
    }

    setBom(newBom);
  };

  const handleAddBom = () => {
    setBom([...robot_bom, { id: "", name: "", price: 0, quantity: 0 }]);
  };

  const handleRemoveBom = (index: number) => {
    const newBom = robot_bom.filter((_, i) => i !== index);
    setBom(newBom);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (robot_images.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }
    const newFormData: Robot = {
      robot_id: "",
      name: robot_name,
      description: robot_description,
      owner: "Bob",
      bom: robot_bom,
      images: robot_images,
    };
    try {
      await api.addRobot(newFormData);
      setMessage(`Robot added successfully.`);
    } catch (error) {
      setMessage("Error adding robot ");
    }
  };

  return (
    <Row>
      <h2>Add a New Robot</h2>
      {message && <p>{message}</p>}
      <Form onSubmit={handleSubmit} className="mb-3">
        Name:
        <Form.Control
          className="mb-3"
          type="text"
          placeholder="Robot Name:"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={robot_name}
          required
        />
        Description:
        <Form.Control
          className="mb-3"
          type="text"
          placeholder="Robot Description:"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={robot_description}
          required
        />
        Images:
        {robot_images.map((image, index) => (
          <Row key={index} className="mb-3">
            <Col md={12}>
              <Form.Control
                className="mb-1"
                type="text"
                placeholder="Image URL"
                name="url"
                value={image.url}
                onChange={(e) => handleImageChange(index, e)}
                required
              />
              <Form.Control
                className="mb-1"
                type="text"
                placeholder="Image Caption"
                name="caption"
                value={image.caption}
                onChange={(e) => handleImageChange(index, e)}
                required
              />
            </Col>
            <Col md={12}>
              <Button
                className="mb-3"
                size="sm"
                variant="danger"
                onClick={() => handleRemoveImage(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Col md={6}>
          <Button className="mb-3" variant="primary" onClick={handleAddImage}>
            Add Image
          </Button>
        </Col>
        Bill of Materials:
        {robot_bom.map((bom, index) => (
          <Row key={index} className="mb-3">
            <Col md={12}>
              Part Name:
              <Form.Control
                className="mb-1"
                type="text"
                placeholder="Part Name: "
                name="name"
                value={bom.name}
                onChange={(e) => handleBomChange(index, e)}
                required
              />
              Quantity:
              <Form.Control
                className="mb-1"
                type="number"
                placeholder="Quantity:"
                name="quantity"
                value={bom.quantity}
                onChange={(e) => handleBomChange(index, e)}
                required
              />
              Individual Price:
              <Form.Control
                className="mb-1"
                type="number"
                placeholder="Price:"
                name="price"
                value={bom.price}
                onChange={(e) => handleBomChange(index, e)}
                required
              />
            </Col>
            <Col md={12}>
              <Button
                className="mb-3"
                size="sm"
                variant="danger"
                onClick={() => handleRemoveBom(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Col md={6}>
          <Button className="mb-3" variant="primary" onClick={handleAddBom}>
            Add Part
          </Button>
        </Col>
        Submit:
        <Col md={6}>
          <Button type="submit">Add Robot!</Button>
        </Col>
      </Form>
    </Row>
  );
};

export default RobotForm;