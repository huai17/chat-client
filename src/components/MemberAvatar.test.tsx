import { render, screen } from "@testing-library/react";
import { MemberAvatar } from "./MemberAvatar";

describe("MemberAvatar", () => {
  test("renders first character of name", () => {
    const name = "Name";
    const left = false;
    render(<MemberAvatar name={name} left={left} />);
    const element = screen.getByText(name[0]);
    expect(element).toBeInTheDocument();
  });
});
