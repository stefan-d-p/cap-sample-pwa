import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Form,
  Provider,
  TextArea,
  TextField,
  View,
  Item,
  defaultTheme,
  Text,
  ActionBarContainer,
  ActionBar,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Heading,
} from "@adobe/react-spectrum";
import { useState } from "react";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

function App() {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const contacts = useLiveQuery(() => db.contacts.toArray());

  const [selectedContacts, setSelectedContacts] = useState(new Set());

  const onSubmit = async (data) => {
    const { name, address } = data;
    try {
      // eslint-disable-next-line no-unused-vars
      const id = await db.contacts.add({
        name,
        address,
      });
    } catch (error) {
      console.error(`Could not create contact ${name} in database`);
    }
    reset({});
  };

  const onDelete = async (key) => {
    if (key !== "delete") throw "Invalid operation";
    try {
      const keys = Array.from(selectedContacts).map(Number);
      await db.contacts.where("id").anyOf(keys).delete();
      clearContactSelection();
    } catch (error) {
      console.error(`Could not delete contacts from database`);
    }
  };

  const clearContactSelection = () => {
    setSelectedContacts(new Set());
  };

  return (
    <Provider theme={defaultTheme}>
      <View elementType="main" minHeight="100vh" padding="size-300">
        <Heading level={1}>Contacts</Heading>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Please provide a full name" }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                label="Full Name"
                aria-label="Full Name"
                description="First name followed by last name"
                isRequired
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            rules={{ required: "Please provide an address" }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextArea
                {...field}
                label="Address"
                aria-label="Address"
                description="Full address"
                isRequired
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />

          <Button type="submit" variant="cta" aria-label="Save Contact">
            Save Contact
          </Button>
        </Form>

        <View marginTop="size-300">
          <ActionBarContainer>
            <TableView
              selectionMode="multiple"
              aria-label="Contact List"
              selectedKeys={selectedContacts}
              onSelectionChange={setSelectedContacts}
            >
              <TableHeader>
                <Column>Name</Column>
                <Column>Address</Column>
              </TableHeader>
              <TableBody>
                {contacts?.map((contact) => (
                  <Row key={contact.id}>
                    <Cell>{contact.name}</Cell>
                    <Cell>{contact.address}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
            <ActionBar
              isEmphasized
              selectedItemCount={selectedContacts.size}
              onClearSelection={clearContactSelection}
              onAction={onDelete}
            >
              <Item key="delete">
                <Text>Delete</Text>
              </Item>
            </ActionBar>
          </ActionBarContainer>
        </View>
      </View>
    </Provider>
  );
}

export default App;
