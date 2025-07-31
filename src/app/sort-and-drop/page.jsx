"use client";

import React, { useEffect, useState } from "react";

import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function EFormDesigner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <App />;
}

// ─────────────────────────────────────────────
// Sortable Item Component
function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    padding: "12px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: 6,
    margin: "6px 0",
    cursor: "grab",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    userSelect: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

// ─────────────────────────────────────────────
// Drop Area Component
function DropArea({ column, index, hide }) {
  const id = `droparea-${column}-${index}`;
  const { setNodeRef, isOver } = useSortable({ id });

  const style = {
    height: "36px",
    margin: "6px 0",
    borderRadius: 6,
    backgroundColor: isOver ? "#e6ffe6" : "#f5f5f5",
    border: isOver ? "2px dashed #34c759" : "2px dashed #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: isOver ? "#34c759" : "#aaa",
    fontSize: 12,
    fontStyle: "italic",
    transition: "all 0.2s ease",
  };

  if (hide) return <div style={{ height: "36px", margin: "6px 0", border: "2px dashed white" }} />;

  return (
    <div ref={setNodeRef} style={style}>
      {isOver ? "✅ Drop Here" : "Drop Zone"}
    </div>
  );
}

// ─────────────────────────────────────────────
// Drag Preview Component
function DragItemPreview({ id }) {
  const style = {
    padding: "12px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: 6,
    opacity: 0.5,
    pointerEvents: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    userSelect: "none",
  };

  return <div style={style}>{id}</div>;
}

// ─────────────────────────────────────────────
// Main App Component
function App() {
  const [leftColumn, setLeftColumn] = useState(Array.from({ length: 4 }, (_, i) => `L-${i + 1}`));
  const [rightColumn, setRightColumn] = useState(Array.from({ length: 4 }, (_, i) => `R-${i + 1}`));
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const findColumn = (id) => {
    if (leftColumn.includes(id)) return "left";
    if (rightColumn.includes(id)) return "right";
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const activeCol = findColumn(active.id);
    const overId = over.id;

    // Sorting within the same column
    if (activeCol === "left" && leftColumn.includes(over.id)) {
      const oldIndex = leftColumn.indexOf(active.id);
      const newIndex = leftColumn.indexOf(over.id);
      setLeftColumn(arrayMove(leftColumn, oldIndex, newIndex));
      return;
    }

    if (activeCol === "right" && rightColumn.includes(over.id)) {
      const oldIndex = rightColumn.indexOf(active.id);
      const newIndex = rightColumn.indexOf(over.id);
      setRightColumn(arrayMove(rightColumn, oldIndex, newIndex));
      return;
    }

    // Cross-column drop into DropArea
    if (overId.startsWith("droparea-")) {
      const [, targetCol, indexStr] = overId.split("-");
      const targetIndex = parseInt(indexStr, 10);

      // Remove from source column
      if (activeCol === "left") {
        setLeftColumn((prev) => prev.filter((id) => id !== active.id));
      } else {
        setRightColumn((prev) => prev.filter((id) => id !== active.id));
      }

      // Insert into target column
      if (targetCol === "left") {
        setLeftColumn((prev) => [...prev.slice(0, targetIndex), active.id, ...prev.slice(targetIndex)]);
      } else {
        setRightColumn((prev) => [...prev.slice(0, targetIndex), active.id, ...prev.slice(targetIndex)]);
      }
    }
  };

  const activeColumn = findColumn(activeId);

  const renderColumn = (items, columnName) => {
    const hideDropAreas = activeColumn === columnName;

    return (
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id, index) => (
          <React.Fragment key={id}>
            <DropArea column={columnName} index={index} hide={hideDropAreas} />
            <SortableItem id={id} />
          </React.Fragment>
        ))}
        <DropArea column={columnName} index={items.length} hide={hideDropAreas} />
      </SortableContext>
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "40px", padding: 30 }}>
        <div style={{ width: 260, padding: 10, background: "#fdfdfd", borderRadius: 8, boxShadow: "0 0 8px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginBottom: 10 }}>Left Column</h3>
          {renderColumn(leftColumn, "left")}
        </div>

        <div style={{ width: 260, padding: 10, background: "#fdfdfd", borderRadius: 8, boxShadow: "0 0 8px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginBottom: 10 }}>Right Column</h3>
          {renderColumn(rightColumn, "right")}
        </div>
      </div>

      <DragOverlay adjustScale={false} dropAnimation={null}>
        {activeId ? <DragItemPreview id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
