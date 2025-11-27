import { ref } from "vue";

const API_BASE = "/student/schedule-open";

export function useScheduleIndex() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchIndex = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE}/api-index`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        if (res.status === 402) {
          const err = await res.json();
          throw new Error(err.error?.message || "Invalid params");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      data.value = await res.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, fetchIndex };
}

export function useScheduleList(type, value, dateStart = null, dateEnd = null) {
  const schedule = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchList = async () => {
    if (!["group", "teacher", "classroom"].includes(type)) {
      throw new Error(
        'Invalid type. Must be "group", "teacher", or "classroom".'
      );
    }
    if (!value) {
      throw new Error("Value is required.");
    }

    loading.value = true;
    error.value = null;

    const params = new URLSearchParams();
    params.append("type", type);
    params.append("value", value);
    if (dateStart) params.append("dateStart", dateStart);
    if (dateEnd) params.append("dateEnd", dateEnd);

    try {
      const url = `${API_BASE}/api-list?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        if (res.status === 402) {
          const err = await res.json();
          throw new Error(err.error?.message || "Invalid params");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      schedule.value = await res.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { schedule, loading, error, fetchList };
}

export function useScheduleCompact(type, value, dateStart = null) {
  const schedule = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchCompact = async () => {
    if (!["group", "teacher", "classroom"].includes(type)) {
      throw new Error(
        'Invalid type. Must be "group", "teacher", or "classroom".'
      );
    }
    if (!value) {
      throw new Error("Value is required.");
    }

    loading.value = true;
    error.value = null;

    const params = new URLSearchParams();
    params.append("type", type);
    params.append("value", value);
    if (dateStart) params.append("dateStart", dateStart);

    try {
      const url = `${API_BASE}/api-compact?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        if (res.status === 402) {
          const err = await res.json();
          throw new Error(err.error?.message || "Invalid params");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      schedule.value = await res.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { schedule, loading, error, fetchCompact };
}
