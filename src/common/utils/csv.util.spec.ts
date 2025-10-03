import { toCSV } from './csv.util';

describe('toCSV', () => {
  it('genera CSV con headers y filas', async () => {
    const rows = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }];
    const csv = await toCSV(rows);
    expect(csv).toContain('id,name');
    expect(csv).toContain('1,A');
    expect(csv).toContain('2,B');
  });
});
