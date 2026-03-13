"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import ImageUpload from "@/components/image-upload";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  tagIds: string[];
  published: boolean;
}

export default function EditorPage({ params }: { params: Promise<{ id?: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = resolvedParams?.id;
  const isEditing = !!postId;

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState<PostData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    categoryId: "",
    tagIds: [],
    published: false,
  });

  // 加载分类和标签
  useEffect(() => {
    async function loadOptions() {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);
        if (categoriesRes.ok) {
          setCategories(await categoriesRes.json());
        }
        if (tagsRes.ok) {
          setTags(await tagsRes.json());
        }
      } catch (error) {
        console.error("加载选项失败:", error);
      }
    }
    loadOptions();
  }, []);

  // 如果是编辑模式，加载文章数据
  useEffect(() => {
    if (!isEditing) return;

    async function loadPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (res.ok) {
          const post = await res.json();
          setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || "",
            coverImage: post.coverImage || "",
            categoryId: post.categoryId || "",
            tagIds: post.tags?.map((t: any) => t.tagId) || [],
            published: post.published,
          });
        }
      } catch (error) {
        console.error("加载文章失败:", error);
      }
    }
    loadPost();
  }, [postId, isEditing]);

  // 根据标题自动生成 slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditing ? `/api/posts/${postId}` : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEditing ? "文章已更新" : "文章已创建");
        router.push("/admin");
      } else {
        const error = await res.json();
        toast.error(error.error || "操作失败");
      }
    } catch (error) {
      toast.error("操作失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || generateSlug(newTitle),
    }));
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 在光标位置插入文本
  const insertAtCursor = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selectedText = value.slice(start, end);

    const newValue = value.slice(0, start) + before + selectedText + after + value.slice(end);
    setFormData((prev) => ({ ...prev, content: newValue }));

    // 恢复光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleImageUpload = (url: string) => {
    insertAtCursor(`![image](${url})\n`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">{isEditing ? "编辑文章" : "新建文章"}</h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? "修改文章内容" : "创建一篇新的博客文章"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin">
            <Button variant="outline">取消</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="输入文章标题"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL 别名</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="article-url-slug"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>内容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Markdown 内容</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertAtCursor("**", "**")}
                    >
                      粗体
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertAtCursor("*", "*")}
                    >
                      斜体
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertAtCursor("# ")}
                    >
                      标题
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertAtCursor("[", "](url)")}
                    >
                      链接
                    </Button>
                    <ImageUpload onUpload={handleImageUpload} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Textarea
                    ref={textareaRef}
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="# 文章标题&#10;&#10;开始写作..."
                    className="min-h-[400px] font-mono"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>发布设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, published: e.target.checked }))
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    立即发布
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分类</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">无分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>标签</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tagIds: prev.tagIds.includes(tag.id)
                            ? prev.tagIds.filter((id) => id !== tag.id)
                            : [...prev.tagIds, tag.id],
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.tagIds.includes(tag.id)
                          ? "bg-[var(--color-mavericks-navy)] text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">暂无标签</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>封面图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                    }
                    placeholder="输入图片 URL"
                    className="flex-1"
                  />
                  <ImageUpload
                    onUpload={(url) =>
                      setFormData((prev) => ({ ...prev, coverImage: url }))
                    }
                  />
                </div>
                {formData.coverImage && (
                  <div className="relative aspect-video overflow-hidden rounded-md">
                    <img
                      src={formData.coverImage}
                      alt="封面预览"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
