import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface NameInputProps {
  name: string;
  onNameChange: (name: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ name, onNameChange }) => {
  return (
    <React.Fragment>
      <Label htmlFor="timer-name" className="mb-2 block text-base">
        Name your timer
      </Label>

      <Input
        value={name}
        id="timer-name"
        placeholder="Timer name"
        className="text-base"
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
      />
    </React.Fragment>
  );
};

export default NameInput;
