import { Ticket } from "../ticket";

it("test optimistic locking", async () => {
  const ticket = Ticket.build({
    userId: "123",
    title: "title",
    price: 10,
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secoundInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 15 });
  secoundInstance!.set({ price: 20 });

  try {
    await firstInstance!.save();
    await secoundInstance!.save();
  } catch (error) {
    return;
  }

  throw Error("Should not reach this point");
});

it("increments the version number on multiple save", async () => {
  const ticket = Ticket.build({
    userId: "123",
    title: "title",
    price: 10,
  });

  await ticket.save();
  expect(ticket.version).toEqual(0)
  await ticket.save();
  expect(ticket.version).toEqual(1)
  await ticket.save();
  expect(ticket.version).toEqual(2)
});
