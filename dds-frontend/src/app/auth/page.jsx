"use client";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";

export default function Auth() {
  return (
    <main className="container mx-auto my-4">
      <Card>
        <CardBody>
          <Tabs selectedKey="login">
            <Tab key="login" title="Login">
              <form></form>
            </Tab>
            <Tab key="register" title="Register">
              <div></div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </main>
  );
}
