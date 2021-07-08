import { render, screen } from "@testing-library/react";
import { MemberAvatar } from "./MemberAvatar";

describe("MemberAvatar", () => {
  const renderMemberAvatar = (): { name: string } => {
    const name = "Name";
    const left = false;
    render(<MemberAvatar name={name} left={left} />);

    return { name };
  };

  test("renders first character of name", () => {
    const { name } = renderMemberAvatar();
    const element = screen.getByText(name[0]);
    expect(element).toBeInTheDocument();
  });
});
