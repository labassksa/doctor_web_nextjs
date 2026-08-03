import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  beginCallAttempt,
  finishCallAttempt,
  isCallEventForActiveCall,
  isCallEventForConsultation,
} from '../src/utils/videoCall.ts';

test('rapid repeated call actions are synchronously guarded', () => {
  const guard = { current: false };

  assert.equal(beginCallAttempt(guard), true);
  for (let attempt = 0; attempt < 10; attempt += 1) {
    assert.equal(beginCallAttempt(guard), false);
  }
});

test('a deliberate retry is allowed after the pending attempt finishes', () => {
  const guard = { current: false };

  assert.equal(beginCallAttempt(guard), true);
  finishCallAttempt(guard);
  assert.equal(beginCallAttempt(guard), true);
});

test('call events are limited to the current consultation', () => {
  assert.equal(isCallEventForConsultation({ room: '42' }, 42), true);
  assert.equal(isCallEventForConsultation({ consultationId: 43 }, 42), false);
});

test('a stale call id cannot end the active call', () => {
  assert.equal(
    isCallEventForActiveCall({ room: 42, callId: 'old-call' }, 42, 'current-call'),
    false,
  );
  assert.equal(
    isCallEventForActiveCall({ room: 42, callId: 'current-call' }, 42, 'current-call'),
    true,
  );
});

test('legacy events without a call id remain compatible', () => {
  assert.equal(isCallEventForActiveCall({ room: 42 }, 42, 'current-call'), true);
});

test('the doctor call flow has one token request and one LiveKit room owner', async () => {
  const buttonSource = await readFile(
    new URL('../src/components/VideoCallButton.tsx', import.meta.url),
    'utf8',
  );
  const roomSource = await readFile(
    new URL('../src/components/VideoRoom.tsx', import.meta.url),
    'utf8',
  );

  assert.equal(buttonSource.match(/\/get-token/g)?.length, 1);
  assert.doesNotMatch(buttonSource, /useVideoCall/);
  assert.doesNotMatch(roomSource, /room=\{/);
});
