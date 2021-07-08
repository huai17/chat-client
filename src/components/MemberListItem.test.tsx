import { render, screen } from "@testing-library/react";
import { MemberListItem } from "./MemberListItem";

describe("MemberListItem", () => {
  const renderMemberListItem = (left: boolean): { name: string } => {
    const name = "Name";
    render(<MemberListItem name={name} left={left} />);

    return { name };
  };

  describe("MemberAvatar", () => {
    test("renders first character of name", () => {
      const { name } = renderMemberListItem(false);
      const element = screen.getByText(name[0]);
      expect(element).toBeInTheDocument();
    });
  });

  test("renders full name", () => {
    const { name } = renderMemberListItem(false);
    const element = screen.getByText(name);
    expect(element).toBeInTheDocument();
  });

  test("renders online", () => {
    renderMemberListItem(false);
    const element = screen.getByText("online");
    expect(element).toBeInTheDocument();
  });

  test("renders offline", () => {
    renderMemberListItem(true);
    const element = screen.getByText("offline");
    expect(element).toBeInTheDocument();
  });
});
