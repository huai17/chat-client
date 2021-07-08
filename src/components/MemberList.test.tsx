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

  test("renders MemberListItem", () => {
    const { members } = renderMemberList();
    const ids = Object.keys(members);
    const name1 = screen.getByText(members[ids[0]].name);
    const name2 = screen.getByText(members[ids[1]].name);
    const avatar1 = screen.getByText(members[ids[0]].name[0]);
    const avatar2 = screen.getByText(members[ids[1]].name[0]);
    const online = screen.getByText("online");
    const offline = screen.getByText("offline");
    expect(name1).toBeInTheDocument();
    expect(name2).toBeInTheDocument();
    expect(avatar1).toBeInTheDocument();
    expect(avatar2).toBeInTheDocument();
    expect(online).toBeInTheDocument();
    expect(offline).toBeInTheDocument();
  });

  test("renders member list", () => {
    renderMemberList();
    const element = screen.getByText("Member List");
    expect(element).toBeInTheDocument();
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
