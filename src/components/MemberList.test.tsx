import { render, screen, fireEvent } from "@testing-library/react";
import { MemberList } from "./MemberList";
import { Members } from "../service/chat-service";

describe("MemberList", () => {
  const renderMemberList = (): {
    members: Members;
    closeMemberList: jest.Mock<void, []>;
  } => {
    const open = false;
    const id1 = "id";
    const id2 = "anotherId";

    const members: Members = {
      [id1]: { name: "User", left: false },
      [id2]: { name: "New User", left: true },
    };
    const closeMemberList = jest.fn<void, []>();

    render(
      <MemberList
        open={open}
        closeMemberList={closeMemberList}
        members={members}
      />
    );

    return { members, closeMemberList };
  };

  test("renders member list", () => {
    renderMemberList();
    const element = screen.getByText("Member List");
    expect(element).toBeInTheDocument();
  });

  describe("MemberListItem", () => {
    describe("MemberAvatar", () => {
      test("renders first character of name", () => {
        const { members } = renderMemberList();
        const ids = Object.keys(members);
        const name1 = screen.getByText(members[ids[0]].name[0]);
        const name2 = screen.getByText(members[ids[1]].name[0]);
        expect(name1).toBeInTheDocument();
        expect(name2).toBeInTheDocument();
      });
    });

    test("renders full name", () => {
      const { members } = renderMemberList();
      const ids = Object.keys(members);
      const name1 = screen.getByText(members[ids[0]].name);
      const name2 = screen.getByText(members[ids[1]].name);
      expect(name1).toBeInTheDocument();
      expect(name2).toBeInTheDocument();
    });

    test("renders online", () => {
      renderMemberList();
      const element = screen.getByText("online");
      expect(element).toBeInTheDocument();
    });

    test("renders offline", () => {
      renderMemberList();
      const element = screen.getByText("offline");
      expect(element).toBeInTheDocument();
    });
  });

  test("renders close member list button", () => {
    const testId = "close member list";
    renderMemberList();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  test("triggers closeMemberList", () => {
    const testId = "close member list";
    const { closeMemberList } = renderMemberList();
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(closeMemberList.mock.calls.length).toBe(1);
  });
});
