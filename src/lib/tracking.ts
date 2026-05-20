
import { trackSelfDescribingEvent, trackPageView } from '@snowplow/browser-tracker';
import { BingoRoom } from '../types';

const DATA_PRODUCT = {
  id: 'abecc3d9-dab3-4500-a1b8-d4db8854b0c9',
  name: 'Demo Games Website - User Journey',
  domain: 'Customer Analytics',
} as const;

const EVENT_SPEC_IDS = {
  purchase_abandoned: '009f68d1-8b43-4a10-a347-d34396e2ca32',
  room_viewed: '0bfa6a49-98ab-4b37-ad97-39e263a38d0e',
  ticket_purchase: 'a0011142-33f0-4f9c-8408-313a0f7dbe5d',
  ticket_quantity_changed: '0f0de7da-86f9-4a8c-a037-3bab8e9ce27b',
  user_login: '8cc5f53e-9293-4661-b045-b718aeaf94c5',
} as const;

// System entity required by every event
function eventSpec(id: string, name: string) {
  return {
    schema: 'iglu:com.snowplowanalytics.snowplow/event_specification/jsonschema/1-0-3',
    data: {
      id,
      name,
      data_product_id: DATA_PRODUCT.id,
      data_product_name: DATA_PRODUCT.name,
      data_product_domain: DATA_PRODUCT.domain,
    },
  };
}

// Room entity attached to every event
function roomCtx(room: BingoRoom) {
  return {
    schema: 'iglu:com.snplow.sales.aws/room/jsonschema/1-0-0',
    data: {
      room_id: room.id,
      room_name: room.name,
      ticket_price: room.ticketPrice,
      prize_pot: room.prizePot,
      is_featured: room.isFeatured,
      player_count: room.playerCount,
      minutes_until_game: Math.max(
        0,
        Math.round((new Date(room.nextGameTime).getTime() - Date.now()) / 60000)
      ),
    },
  };
}

// 1. Room Viewed — fires when user selects a room from the sidebar
export function trackRoomViewed(room: BingoRoom): void {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snplow.sales.aws/room_viewed/jsonschema/1-0-0',
      data: {
        room_id: room.id,
        room_name: room.name,
        ticket_price: room.ticketPrice,
        prize_pot: room.prizePot,
        is_featured: room.isFeatured,
        player_count: room.playerCount,
        minutes_until_game: Math.max(
          0,
          Math.round((new Date(room.nextGameTime).getTime() - Date.now()) / 60000)
        ),
      },
    },
    context: [roomCtx(room), eventSpec(EVENT_SPEC_IDS.room_viewed, 'Room Viewed')],
  });
}

// 2. Purchase Abandoned — fires on Cancel/Back click or room switch while in ticket selection
export function trackPurchaseAbandoned(
  room: BingoRoom,
  ticketCount: number,
  abandonedAtStep: 'SELECTING_TICKETS' | 'PREVIEWING_TICKETS' = 'SELECTING_TICKETS'
): void {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snplow.sales.aws/purchase_abandoned/jsonschema/1-0-0',
      data: {
        room_id: room.id,
        room_name: room.name,
        ticket_price: room.ticketPrice,
        ticket_count: ticketCount,
        abandoned_at_step: abandonedAtStep,
      },
    },
    context: [roomCtx(room), eventSpec(EVENT_SPEC_IDS.purchase_abandoned, 'Purchase Abandoned')],
  });
}

// 3. Screen View — page view with bingo_screen + room entity
export function trackScreenView(
  screenName: 'VIEWING_LOBBY' | 'SELECTING_TICKETS' | 'PURCHASE_CONFIRMED',
  room: BingoRoom | null
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context: any[] = [
    {
      schema: 'iglu:com.snplow.sales.aws/bingo_screen/jsonschema/1-0-0',
      data: {
        screen_name: screenName,
        room_id: room?.id ?? null,
        room_name: room?.name ?? null,
        ticket_price: room?.ticketPrice ?? null,
        prize_pot: room?.prizePot ?? null,
        player_count: room?.playerCount ?? null,
      },
    },
  ];
  if (room) context.push(roomCtx(room));
  trackPageView({ context });
}

// 4. Ticket Purchase — fires on confirmed purchase, includes click coordinates
export function trackTicketPurchase(
  room: BingoRoom,
  ticketCount: number,
  totalCost: number,
  clickX: number,
  clickY: number
): void {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snplow.sales.aws/ticket_purchase/jsonschema/1-0-0',
      data: {
        room_id: room.id,
        room_name: room.name,
        ticket_price: room.ticketPrice,
        ticket_count: ticketCount,
        total_cost: totalCost,
        click_x: clickX,
        click_y: clickY,
      },
    },
    context: [
      roomCtx(room),
      {
        schema: 'iglu:com.snplow.sales.aws/click_coordinates/jsonschema/1-0-0',
        data: { x: Math.round(clickX), y: Math.round(clickY) },
      },
      eventSpec(EVENT_SPEC_IDS.ticket_purchase, 'Ticket Purchase'),
    ],
  });
}

// 5. Ticket Quantity Changed — fires on every +/- click in the purchase form
export function trackTicketQuantityChanged(
  room: BingoRoom,
  previousQuantity: number,
  newQuantity: number
): void {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snplow.sales.aws/ticket_quantity_changed/jsonschema/1-0-0',
      data: {
        room_id: room.id,
        room_name: room.name,
        ticket_price: room.ticketPrice,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        new_total_cost: Math.round(newQuantity * room.ticketPrice * 100) / 100,
      },
    },
    context: [
      roomCtx(room),
      eventSpec(EVENT_SPEC_IDS.ticket_quantity_changed, 'Ticket Quantity Changed'),
    ],
  });
}

// 6. User Login — fires when demo login is completed (requires room context)
export function trackUserLogin(room: BingoRoom): void {
  trackSelfDescribingEvent({
    event: {
      schema: 'iglu:com.snplow.sales.aws/login_steps/jsonschema/1-0-0',
      data: { action: 'login' },
    },
    context: [roomCtx(room), eventSpec(EVENT_SPEC_IDS.user_login, 'User Login')],
  });
}
