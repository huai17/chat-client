import { render, screen } from "@testing-library/react";
import { MemberListItem } from "./MemberListItem";

describe("MemberListItem", () => {
  test("renders first character of name", () => {
    const name = "Name";
    const left = false;
    render(<MemberListItem name={name} left={left} />);
    const element = screen.getByText(name[0]);
    expect(element).toBeInTheDocument();
  });

  test("renders full name", () => {
    const name = "Name";
    const left = false;
    render(<MemberListItem name={name} left={left} />);
    const element = screen.getByText(name);
    expect(element).toBeInTheDocument();
  });

  test("renders online", () => {
    const name = "Name";
    const left = false;
    render(<MemberListItem name={name} left={left} />);
    const element = screen.getByText("online");
    expect(element).toBeInTheDocument();
  });

  test("renders offline", () => {
    const name = "Name";
    const left = true;
    render(<MemberListItem name={name} left={left} />);
    const element = screen.getByText("offline");
    expect(element).toBeInTheDocument();
  });
});
