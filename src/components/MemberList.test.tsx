import { render, screen, fireEvent } from "@testing-library/react";
import { MemberList } from "./MemberList";

describe("MemberList", () => {
  test("renders member list", () => {
    const open = false;
    const closeMemberList = jest.fn(() => void 0);
    const members = {
      randomId1: { name: "Name 1", left: false },
      randomId2: { name: "Name 2", left: true },
    };
    render(
      <MemberList
        open={open}
        closeMemberList={closeMemberList}
        members={members}
      />
    );
    const element = screen.getByText("Member List");
    expect(element).toBeInTheDocument();
  });

  test("renders members", () => {
    const open = false;
    const closeMemberList = jest.fn(() => void 0);
    const members = {
      randomId1: { name: "Name 1", left: false },
      randomId2: { name: "Name 2", left: true },
    };
    render(
      <MemberList
        open={open}
        closeMemberList={closeMemberList}
        members={members}
      />
    );
    const element1 = screen.getByText(members.randomId1.name);
    expect(element1).toBeInTheDocument();
    const element2 = screen.getByText(members.randomId2.name);
    expect(element2).toBeInTheDocument();
  });

  test("renders close member list button & triggers closeMemberList", () => {
    const open = true;
    const closeMemberList = jest.fn(() => void 0);
    const members = {
      randomId1: { name: "Name 1", left: false },
      randomId2: { name: "Name 2", left: true },
    };
    render(
      <MemberList
        open={open}
        closeMemberList={closeMemberList}
        members={members}
      />
    );
    const element = screen.getByTestId("close member list");
    expect(element).toBeInTheDocument();

    fireEvent.click(element);
    expect(closeMemberList.mock.calls.length).toBe(1);
  });
});
